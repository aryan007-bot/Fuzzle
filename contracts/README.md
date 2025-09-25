# MojoMonster Smart Contracts

This directory contains the Move language smart contracts that power the MojoMonster game. These contracts were developed for the Aptos blockchain and won 2nd place at the Aptos Hack Holland 2023 hackathon.

## Contract Overview: Synthesis_Mating.move

`Synthesis_Mating.move` is the primary contract that implements the core game mechanics for MojoMonster. It leverages Move's powerful type system to create a unique monster breeding and transformation system.

## Core Data Structures

### Monster Types

The contract uses a sophisticated type system to represent monster traits:

1. **Physical Traits (JellyCore)**: 
   - `Solid`: Durable, resilient monsters
   - `Swift`: Fast, agile monsters
   - `Adaptive`: Flexible, evolving monsters
   - `Ferocious`: Aggressive, powerful monsters

2. **Elemental Properties (JooseCore)**:
   - `Earth`: Earth-aligned monsters
   - `Water`: Water-aligned monsters
   - `Fire`: Fire-aligned monsters
   - `None`: Monsters without an elemental alignment

### Primary Resource Types

```move
struct Monstrum<T0, T1> has key {
    jelly_core: JellyCore<T0>,
    joose_core: option::Option<JooseCore<T1>>,
    extend_ref: ExtendRef,
    mutator_ref: MutatorRef,
}

struct Monster<T0, T1> has key {
    jelly_core: JellyCore<T0>,
    joose_core: JooseCore<T1>,
    extend_ref: ExtendRef,
    mutator_ref: MutatorRef,
}

struct Cauldron<T> has key {
    joose_core: JooseCore<T>,
}
```

- `Monstrum<T0, T1>`: A base form monster with physical traits T0 and optional elemental properties T1
- `Monster<T0, T1>`: An evolved monster with both physical traits T0 and elemental properties T1
- `Cauldron<T>`: A container of elemental essence used to transform monsters

## Key Game Mechanics

### 1. Monster Creation

The `create_monstrum` function creates a new base monster (Monstrum) with specified traits:

```move
fun create_monstrum<T0, T1>(
    creator: &signer,
    name: String,
    token_uri: String,
): ConstructorRef
```

This function:
- Creates a named token in the collection
- Generates the necessary references for the object
- Initializes a new Monstrum resource with generic type parameters for traits
- Returns a constructor reference for the created monster

### 2. Elemental Infusion

Two key functions handle the infusion of elemental properties into monsters:

```move
fun infuse_monstrum<T0, T1, T2>(
    creator: &signer,
    monstrum: Object<Monstrum<T0, T1>>,
    cauldron: Object<Cauldron<T2>>,
)
```

```move
fun infuse_monster<T0, T1, T2>(
    creator: &signer,
    monstrum: Object<Monster<T0, T1>>,
    cauldron: Object<Cauldron<T2>>,
)
```

The infusion process:
1. Takes a monster object and a cauldron object
2. If the cauldron's element T2 matches the monster's element T1, does nothing
3. Otherwise, removes the existing monster resource
4. Creates a new monster resource with the same physical traits T0 but new elemental properties T2
5. The monster object is transformed into a new type while maintaining its identity

This uses Move's powerful resource handling to transform the type of an object while preserving its identity - effectively "evolving" the monster with a new elemental property.

### 3. Monster Breeding

The `breed` function creates a new monster by combining traits from two parent monsters:

```move
fun breed<T0, T1, T2, T3>(
    creator: &signer,
    monster1: &Object<Monster<T0, T1>>,
    monster2: &Object<Monster<T2, T3>>,
    token_uri: String,
): address
```

This function:
1. Takes references to two parent monsters with potentially different traits
2. Creates a new token in the collection
3. Determines the traits of the offspring based on parent trait combinations
4. Initializes a new Monster resource with the determined traits
5. Returns the address of the newly created monster

The breeding mechanics include type-based trait inheritance rules:
- Certain parent trait combinations produce specific offspring traits
- For example, breeding two Solid-Earth monsters creates another Solid-Earth monster
- Breeding a Ferocious-Water with a Ferocious-Earth monster creates an Adaptive-Fire monster

## Technical Implementation Details

### Type-Based Game Logic

The contract makes extensive use of Move's type system to implement game logic. For example:

```move
if (type_info::type_of<Comparison<T0, T1, T2, T3>>() == type_info::type_of<Comparison<Solid, Earth, Solid, Earth>>()) {
    // Create a Solid-Earth monster
} else {
    // Create a monster with different traits
}
```

This approach uses compile-time type checking to enforce game rules and ensure type safety throughout the monster creation, infusion, and breeding processes.

### Object Conversion

A key technical aspect is how monsters transform during infusion:

```move
// Example conversion from original contract
let monster_object = object::convert<Monstrum<Ferocious, None>, Monster<Ferocious, Fire>>(monstrum_object);
```

This conversion preserves the object's identity (address) while changing its type. This allows monsters to evolve their types while maintaining their NFT identity and ownership history.

### Resource Management

The contract carefully manages resources to ensure they are never duplicated or lost:

1. When transforming a monster, the original resource is removed using `move_from`
2. A new resource of the appropriate type is created using `move_to`
3. Critical fields like `extend_ref` are preserved across transformations

## Testing

The contract includes a test function that initializes the module:

```move
#[test(owner = @monsters)]
fun test(owner: &signer) acquires Monstrum, Monster, Cauldron {
    init_module(owner);
}
```


