module mojomonster::monster {
    use std::error;
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::timestamp;
    use aptos_token::token::{Self, TokenDataId};

    // Error codes
    const ENO_CAPABILITIES: u64 = 1;
    const EMONSTER_EXISTS: u64 = 2;
    const EMONSTER_DOES_NOT_EXIST: u64 = 3;

    struct Monster has key, store {
        id: TokenDataId,
        name: String,
        power: u64,
        health: u64,
        xp: u64,
        owner: address,
        created_at: u64,
    }

    struct MonsterEvents has key {
        mint_events: EventHandle<MintMonsterEvent>,
        level_up_events: EventHandle<LevelUpEvent>,
    }

    struct MintMonsterEvent has drop, store {
        monster_id: TokenDataId,
        owner: address,
        name: String,
        power: u64,
        health: u64,
    }

    struct LevelUpEvent has drop, store {
        monster_id: TokenDataId,
        owner: address,
        new_power: u64,
        new_health: u64,
        new_xp: u64,
    }

    public entry fun initialize(account: &signer) {
        move_to(account, MonsterEvents {
            mint_events: event::new_event_handle<MintMonsterEvent>(account),
            level_up_events: event::new_event_handle<LevelUpEvent>(account),
        });
    }

    public entry fun mint_monster(
        account: &signer,
        name: String,
    ) acquires MonsterEvents {
        let addr = signer::address_of(account);
        
        // Generate random stats (in production, use VRF or similar)
        let power = timestamp::now_microseconds() % 50 + 50;  // 50-100
        let health = timestamp::now_microseconds() % 50 + 50; // 50-100
        
        let token_data_id = token::create_token_data(
            account,
            string::utf8(b"MojoMonster"),
            name,
            string::utf8(b""),  // Description
            1,                  // Max supply
            string::utf8(b"https://api.mojomonster.io/metadata/"),  // URI (base)
            addr,              // Royalty payee address
            100,              // Royalty points denominator
            0,                // Royalty points numerator
            token::create_token_mutability_config(
                &vector<bool>[false, false, false, false, true]
            ),
            vector::empty<String>(),    // property_keys
            vector::empty<vector<u8>>(), // property_values
            vector::empty<String>(),     // property_types
        );

        // Mint the token to the account
        token::mint_token(
            account,
            token_data_id,
            1,  // Amount
        );

        // Create monster data
        let monster = Monster {
            id: token_data_id,
            name,
            power,
            health,
            xp: 0,
            owner: addr,
            created_at: timestamp::now_microseconds(),
        };

        // Store monster data
        move_to(account, monster);

        // Emit mint event
        let events = borrow_global_mut<MonsterEvents>(@mojomonster);
        event::emit_event(
            &mut events.mint_events,
            MintMonsterEvent {
                monster_id: token_data_id,
                owner: addr,
                name,
                power,
                health,
            },
        );
    }

    public fun get_monster_stats(addr: address): (u64, u64, u64) acquires Monster {
        let monster = borrow_global<Monster>(addr);
        (monster.power, monster.health, monster.xp)
    }

    public entry fun gain_xp(
        account: &signer,
        amount: u64
    ) acquires Monster, MonsterEvents {
        let addr = signer::address_of(account);
        let monster = borrow_global_mut<Monster>(addr);
        
        monster.xp = monster.xp + amount;
        
        // Level up stats for every 100 XP
        let levels = monster.xp / 100;
        monster.power = monster.power + (levels * 10);
        monster.health = monster.health + (levels * 10);

        // Emit level up event
        let events = borrow_global_mut<MonsterEvents>(@mojomonster);
        event::emit_event(
            &mut events.level_up_events,
            LevelUpEvent {
                monster_id: monster.id,
                owner: addr,
                new_power: monster.power,
                new_health: monster.health,
                new_xp: monster.xp,
            },
        );
    }
}