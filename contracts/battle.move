module mojomonster::battle {
    use std::error;
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::timestamp;
    use mojomonster::monster::{Self, Monster};

    // Error codes
    const EBATTLE_EXISTS: u64 = 1;
    const EBATTLE_NOT_FOUND: u64 = 2;
    const EBATTLE_ALREADY_STARTED: u64 = 3;
    const EINSUFFICIENT_BALANCE: u64 = 4;
    const EINVALID_MONSTER: u64 = 5;

    struct Battle has key, store {
        id: String,
        challenger: address,
        opponent: Option<address>,
        challenger_monster: Monster,
        opponent_monster: Option<Monster>,
        bet_amount: u64,
        status: u8, // 0: open, 1: in_progress, 2: completed
        winner: Option<address>,
        created_at: u64,
    }

    struct BattleEvents has key {
        create_events: EventHandle<CreateBattleEvent>,
        join_events: EventHandle<JoinBattleEvent>,
        complete_events: EventHandle<CompleteBattleEvent>,
    }

    struct CreateBattleEvent has drop, store {
        battle_id: String,
        challenger: address,
        bet_amount: u64,
        timestamp: u64,
    }

    struct JoinBattleEvent has drop, store {
        battle_id: String,
        opponent: address,
        timestamp: u64,
    }

    struct CompleteBattleEvent has drop, store {
        battle_id: String,
        winner: address,
        reward_amount: u64,
        timestamp: u64,
    }

    public entry fun initialize(account: &signer) {
        move_to(account, BattleEvents {
            create_events: event::new_event_handle<CreateBattleEvent>(account),
            join_events: event::new_event_handle<JoinBattleEvent>(account),
            complete_events: event::new_event_handle<CompleteBattleEvent>(account),
        });
    }

    public entry fun create_battle(
        account: &signer,
        battle_id: String,
        monster_id: String,
        bet_amount: u64
    ) acquires BattleEvents {
        let addr = signer::address_of(account);
        
        // Verify challenger has enough APT
        assert!(
            coin::balance<AptosCoin>(addr) >= bet_amount,
            error::invalid_argument(EINSUFFICIENT_BALANCE)
        );

        // Lock the bet amount
        coin::transfer<AptosCoin>(account, @mojomonster, bet_amount);

        // Get challenger's monster
        let (power, health, xp) = monster::get_monster_stats(addr);
        
        // Create battle
        let battle = Battle {
            id: battle_id,
            challenger: addr,
            opponent: option::none(),
            challenger_monster: monster,
            opponent_monster: option::none(),
            bet_amount,
            status: 0, // open
            winner: option::none(),
            created_at: timestamp::now_microseconds(),
        };

        move_to(account, battle);

        // Emit create event
        let events = borrow_global_mut<BattleEvents>(@mojomonster);
        event::emit_event(
            &mut events.create_events,
            CreateBattleEvent {
                battle_id,
                challenger: addr,
                bet_amount,
                timestamp: timestamp::now_microseconds(),
            },
        );
    }

    public entry fun join_battle(
        account: &signer,
        battle_id: String,
        monster_id: String,
    ) acquires Battle, BattleEvents {
        let addr = signer::address_of(account);
        
        // Get battle
        let battle = borrow_global_mut<Battle>(@mojomonster);
        assert!(battle.status == 0, error::invalid_argument(EBATTLE_ALREADY_STARTED));
        
        // Verify opponent has enough APT
        assert!(
            coin::balance<AptosCoin>(addr) >= battle.bet_amount,
            error::invalid_argument(EINSUFFICIENT_BALANCE)
        );

        // Lock the bet amount
        coin::transfer<AptosCoin>(account, @mojomonster, battle.bet_amount);

        // Get opponent's monster
        let (power, health, xp) = monster::get_monster_stats(addr);
        
        // Update battle
        battle.opponent = option::some(addr);
        battle.opponent_monster = option::some(monster);
        battle.status = 1; // in_progress

        // Emit join event
        let events = borrow_global_mut<BattleEvents>(@mojomonster);
        event::emit_event(
            &mut events.join_events,
            JoinBattleEvent {
                battle_id,
                opponent: addr,
                timestamp: timestamp::now_microseconds(),
            },
        );

        // Auto-resolve battle
        resolve_battle(battle_id);
    }

    fun resolve_battle(battle_id: String) acquires Battle, BattleEvents {
        let battle = borrow_global_mut<Battle>(@mojomonster);
        assert!(battle.status == 1, error::invalid_argument(EBATTLE_NOT_FOUND));

        // Calculate winner using monster stats and some randomness
        let challenger_power = battle.challenger_monster.power;
        let opponent_power = battle.opponent_monster.power;
        
        // Add random boost (in production use VRF)
        let challenger_boost = timestamp::now_microseconds() % 20; // 0-19
        let opponent_boost = (timestamp::now_microseconds() >> 20) % 20; // 0-19
        
        let challenger_total = challenger_power + challenger_boost;
        let opponent_total = opponent_power + opponent_boost;

        let winner_addr;
        if (challenger_total >= opponent_total) {
            winner_addr = battle.challenger;
        } else {
            winner_addr = *option::borrow(&battle.opponent);
        };

        // Transfer reward (2x bet amount minus 5% fee)
        let reward_amount = (battle.bet_amount * 2) * 95 / 100;
        coin::transfer<AptosCoin>(@mojomonster, winner_addr, reward_amount);

        // Update battle
        battle.status = 2; // completed
        battle.winner = option::some(winner_addr);

        // Award XP
        monster::gain_xp(winner_addr, 50);

        // Emit complete event
        let events = borrow_global_mut<BattleEvents>(@mojomonster);
        event::emit_event(
            &mut events.complete_events,
            CompleteBattleEvent {
                battle_id,
                winner: winner_addr,
                reward_amount,
                timestamp: timestamp::now_microseconds(),
            },
        );
    }

    #[view]
    public fun get_battle(battle_id: String): (address, Option<address>, u64, u8, Option<address>) acquires Battle {
        let battle = borrow_global<Battle>(@mojomonster);
        (
            battle.challenger,
            battle.opponent,
            battle.bet_amount,
            battle.status,
            battle.winner,
        )
    }
}