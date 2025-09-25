infuse_monstrum( creator, monstrum_object, fire_cauldron_object);
  0x1::debug::print(&token::name(monstrum_object));
  let monster_object = object::convert<Monstrum<Ferocious, None>, Monster<Ferocious, Fire>>(monstrum_object);
  0x1::debug::print(&token::name(monster_object));
  infuse_monster( creator, monster_object, water_cauldron_object);
  let monster_object = object::convert<Monster<Ferocious, Fire>, Monster<Ferocious, Water>>(monster_object);
  infuse_monster( creator, monster_object, earth_cauldron_object);
  let monster_object = object::convert<Monster<Ferocious, Water>, Monster<Ferocious, Earth>>(monster_object);
  //std::debug::print(&view_object(monstrum_object));
  0x1::debug::print(&token::name(monster_object));

  let monstrum_image_uri = string::utf8(b"image.uri//");
  let monstrum_constructor_ref = create_monstrum<Ferocious, None>(creator, string::utf8(b"Monstrum #2"), monstrum_image_uri);
  let solid_water_monstrum_object = object::object_from_constructor_ref<Monstrum<Ferocious, None>>(&monstrum_constructor_ref);
  0x1::debug::print(&token::name(solid_water_monstrum_object));

  infuse_monstrum( creator, solid_water_monstrum_object, water_cauldron_object );
  let solid_water_monstrum_object = object::convert<Monstrum<Ferocious, None>, Monster<Ferocious, Water>>(solid_water_monstrum_object);

  0x1::debug::print(&token::name(solid_water_monstrum_object));


  0x1::debug::print(&string_utils::format2(&b"monster #1 name: {}, object address: {}", token::name(monster_object), object::object_address(&monster_object)));
  0x1::debug::print(&string_utils::format2(&b"monster #2 name: {}, object address: {}", token::name(solid_water_monstrum_object), object::object_address(&solid_water_monstrum_object)));

  let bred_monster_addr = breed(
   creator,
   &monster_object,
   &solid_water_monstrum_object,
   string::utf8(b"uri")
  );
  0x1::debug::print(&bred_monster_addr);
  //let bred_adaptive_fire_monster = object::address_to_object<Monster<Adaptive, Fire>>(bred_monster_addr);
  //0x1::debug::print(&bred_adaptive_fire_monster);
  //0x1::debug::print(&string_utils::format2(&b"monster #3 name: {}, object address: {}", token::name(bred_adaptive_fire_monster), bred_monster_addr));
 }

 fun create_monstrum<T0, T1>(
  creator: &signer,
  name: String,
  token_uri: String,
 ): ConstructorRef {
  let constructor_ref = token::create_named_token(
   creator,
   string::utf8(COLLECTION_NAME),
   string::utf8(TOKEN_DESCRIPTION),
   name,
   option::none(),
   token_uri,
  );
  let token_signer = object::generate_signer(&constructor_ref);
  let extend_ref = object::generate_extend_ref(&constructor_ref);
  let mutator_ref = token::generate_mutator_ref(&constructor_ref);

  move_to(
   &token_signer,
   Monstrum<T0, T1> {
    jelly_core: JellyCore<T0> { },
    joose_core: option::some(JooseCore<T1> { }),
    extend_ref,
    mutator_ref,
   }
  );

  constructor_ref
 }

 fun create_cauldron<T>(
  creator: &signer,
  name: String,
  token_uri: String,
 ): ConstructorRef {
  let constructor_ref = token::create_named_token(
   creator,
   string::utf8(COLLECTION_NAME),
   string::utf8(TOKEN_DESCRIPTION),
   name,
   option::none(),
   token_uri,
  );
  let token_signer = object::generate_signer(&constructor_ref);

  move_to(
   &token_signer,
   Cauldron<T> {
    joose_core: JooseCore<T> { },
   }
  );

  constructor_ref
 }

 fun breed<T0, T1, T2, T3>(
  creator: &signer,
  _monster1: &Object<Monster<T0, T1>>,
  _monster2: &Object<Monster<T2, T3>>,
  token_uri: String,
 ): address {

  // struct Solid has drop, store { }
  // struct Swift has drop, store { }
  // struct Adaptive has drop, store { }
  // struct Ferocious has drop, store { }

  // struct Earth has drop, store { }
  // struct Water has drop, store { }
  // struct Fire has drop, store { }

  let collection_addr = collection::create_collection_address(&0x1::signer::address_of(creator), &string::utf8(COLLECTION_NAME));
  let _collection_object = object::address_to_object<Collection>(collection_addr);
  
  let constructor_ref = token::create_named_token(
   creator,
   string::utf8(COLLECTION_NAME),
   string::utf8(TOKEN_DESCRIPTION),
   string::utf8(b"Monster #3"),//string_utils::format1(&b"Monster #", option::some(collection::count(collection_object))),
   option::none(),
   token_uri,
  );

  let token_signer = object::generate_signer(&constructor_ref);
  let extend_ref = object::generate_extend_ref(&constructor_ref);
  let mutator_ref = token::generate_mutator_ref(&constructor_ref);

  if (type_info::type_of<Comparison<T0, T1, T2, T3>>() == type_info::type_of<Comparison<Solid, Earth, Solid, Earth>>()) {
   move_to(
    &token_signer,
    Monster<Solid, Earth> {
     jelly_core: JellyCore<Solid> { },
     joose_core: JooseCore<Earth> { },
     extend_ref,
     mutator_ref,
    }
   );
  } else {// if (type_info::type_of<Comparison<T0, T1, T2, T3>>() == type_info::type_of<Comparison<Ferocious, Water, Ferocious, Earth>>()) {
   move_to(
    &token_signer,
    Monster<Adaptive, Fire> {
     jelly_core: JellyCore<Adaptive> { },
     joose_core: JooseCore<Fire> { },
     extend_ref,
     mutator_ref,
    }
   );
  };

  0x1::signer::address_of(&token_signer)
 }

 fun infuse_monstrum<T0, T1, T2>(
  creator: &signer,
  monstrum: Object<Monstrum<T0, T1>>,
  cauldron: Object<Cauldron<T2>>,
 ) acquires Monstrum, Monster, Cauldron {
  let _ = 0x1::signer::address_of(creator);

  let monstrum_addr = object::object_address(&monstrum);
  let monstrum_object_resource = borrow_global<Monstrum<T0, T1>>(monstrum_addr);
  let extend_ref = &monstrum_object_resource.extend_ref;
  let token_signer = object::generate_signer_for_extending(extend_ref);

  //////////////// instead of doing a move_from for each specific type of type info, just do a generic
  // move from for T0, T1, and then move_to(token_signer, )

  if (type_info::type_of<T1>() == type_info::type_of<T2>()) {
   return
  } else {
   // delete the Monstrum resource with T1 typing, capture old jelly_core and extend_ref
   let Monstrum<T0, T1> {
    jelly_core,
    joose_core: _,
    extend_ref,
    mutator_ref,
   } = move_from<Monstrum<T0, T1>>(monstrum_addr);

   // TODO: make this based off of actual name, need #[view] fun index(...) in token.move!
   //let token_monstrum_object = object::convert<Monstrum<T0, T1>, Token>(monstrum);
   let token_name = if (token::name(monstrum) == string::utf8(b"Monstrum #1")) {
    string::utf8(b"Monster #1")
   } else if (token::name(monstrum) == string::utf8(b"Monstrum #2")) {
    string::utf8(b"Monster #2")
   } else {
    abort 12345
   };

   token::set_name(&mutator_ref, token_name);

   // create a new Monster resource with the T0, T2 typing and extend_ref into Monstrum at same object address.
   move_to(
    &token_signer,
    Monster<T0, T2> {
     jelly_core,
     joose_core: JooseCore<T2> { },
     extend_ref,
     mutator_ref,
    }
   );
   // the Monstrum<T0, T1> object has now been converted to a Monster<T0, T2> object
  };


  if (type_info::type_of<T0>() == type_info::type_of<Ferocious>()) {
   //std::debug::print(&string::utf8(b"ferocious type!"));
  };
  if (exists<Monster<T0, T2>>(monstrum_addr)) {
   let s = string_utils::debug_string(borrow_global<Monster<T0, T2>>(monstrum_addr));
   std::debug::print(&s);
  };

  let cauldron_addr = object::object_address(&cauldron);
  if (exists<Cauldron<T2>>(cauldron_addr)) {
   let _s = string_utils::debug_string(borrow_global<Cauldron<T2>>(cauldron_addr));
   //std::debug::print(&s);
  }
 }

 fun infuse_monster<T0, T1, T2>(
  creator: &signer,
  monstrum: Object<Monster<T0, T1>>,
  cauldron: Object<Cauldron<T2>>,
 ) acquires Monster, Cauldron {
  let _ = 0x1::signer::address_of(creator);

  let monstrum_addr = object::object_address(&monstrum);
  let monstrum_object_resource = borrow_global<Monster<T0, T1>>(monstrum_addr);
  let extend_ref = &monstrum_object_resource.extend_ref;
  let token_signer = object::generate_signer_for_extending(extend_ref);


if (type_info::type_of<T1>() == type_info::type_of<T2>()) {
   return
  } else {
   // delete the Monster resource with T1 typing, capture old jelly_core and extend_ref
   let Monster<T0, T1> {
    jelly_core,
    joose_core: _,
    extend_ref,
    mutator_ref,
   } = move_from<Monster<T0, T1>>(monstrum_addr);

   // create a new Monster resource with the T0, T2 typing and extend_ref into Monstrum at same object address.
   move_to(
    &token_signer,
    Monster<T0, T2> {
     jelly_core,
     joose_core: JooseCore<T2> { },
     extend_ref,
     mutator_ref,
    }
   );
   // the Monster<T0, T1> object has now been converted to a Monster<T0, T2> object
  };

  if (type_info::type_of<T0>() == type_info::type_of<Ferocious>()) {
   //std::debug::print(&string::utf8(b"ferocious type!"));
  };
  if (exists<Monster<T0, T2>>(monstrum_addr)) {
   let s = string_utils::debug_string(borrow_global<Monster<T0, T2>>(monstrum_addr));
   std::debug::print(&s);
  };

  let cauldron_addr = object::object_address(&cauldron);
  if (exists<Cauldron<T2>>(cauldron_addr)) {
   let _s = string_utils::debug_string(borrow_global<Cauldron<T2>>(cauldron_addr));
   //std::debug::print(&s);
  }
 }

 fun rand_range(start: u64, end: u64): u64 {
  assert!(end > start, 123456);
  let now = 0x1::timestamp::now_microseconds();
  let range = end - start;
  assert!(now > range, 1234567);
  let modulo = now % range;
  range + modulo
 }

   // #[view]
   // fun view_monster<Monster<T0, T1>: key>(obj: Object<Monster>): String acquires  {
   //    let token_address = object::object_address(&obj);
   //    //string::utils::to_string(borrow_global<T>(token_address))
   //    string_utils::debug_string(borrow_global<Monstrum<T0, T1>>(token_address))
   // }

   #[test(owner = @monsters)]
   fun test(
      owner: &signer,
   ) acquires Monstrum, Monster, Cauldron {
      init_module(owner);
   }


}
