import type { ServiceArea } from './types';

/**
 * The parishes and municipalities InkSmith Studios draws clients from.
 *
 * IMPORTANT — these are not location pages for multiple branches. There is one
 * studio, at 39 King St in the City of Hamilton. Each entry answers a real
 * question ("how do I get there from where I live, and what should I know")
 * with facts specific to that parish. Templated filler here would be worse than
 * having no area pages at all, so `scripts/check-content.mjs` fails the build
 * if any entry is too thin or duplicates another.
 *
 * Facts used below are limited to things that are genuinely verifiable about
 * Bermuda: the island-wide 35 km/h speed limit, the fact that visitors cannot
 * rent cars, the locations of the Hamilton bus and ferry terminals, and parish
 * geography. Specific bus route numbers are deliberately omitted rather than
 * guessed — `travel.byBus.routes` is optional for exactly that reason.
 */
export const serviceAreas: ServiceArea[] = [
  {
    slug: 'hamilton',
    name: 'Hamilton',
    designation: 'City of Hamilton',
    isStudioLocation: true,
    answer:
      'InkSmith Studios is located in the City of Hamilton at 39 King St, on the second floor of the Ratteray Building, postcode HM 19. The studio is open Monday to Saturday from 12:00 PM to 8:00 PM and Sunday from 11:00 AM to 7:00 PM, and walk-ins are welcome during those hours.',
    metaTitle: 'Tattoo & Piercing Studio in Hamilton, Bermuda',
    metaDescription:
      'InkSmith Studios is at 39 King St, Hamilton HM 19. Custom tattoos and body piercing in central Bermuda. Walk-ins welcome, free consultations, open seven days.',
    intro: [
      'The City of Hamilton is Bermuda’s capital and its commercial centre, and it is where InkSmith Studios has always been. The studio occupies the second floor of the Ratteray Building at 39 King St, a short walk from Front Street, the ferry terminal and the bus terminal on Washington Street.',
      'A point of confusion worth clearing up first: the City of Hamilton is not the same place as Hamilton Parish. The city sits inside Pembroke Parish on the north side of Hamilton Harbour. Hamilton Parish is a separate parish some distance to the east, near Flatts and Bailey’s Bay. If you are navigating to the studio, you want the City of Hamilton — HM 19, off Church Street and Reid Street.',
      'Because the studio sits in the middle of the island’s transport network, Hamilton is the easiest place in Bermuda to reach for an appointment. Every public bus route terminates here and every commuter ferry docks here, which is why clients from all nine parishes end up at the same address.',
    ],
    travel: {
      summary:
        'The studio is in central Hamilton, walkable from anywhere in the city and a few minutes from both the bus terminal and the ferry terminal.',
      byBus: {
        text: 'Every public bus route on the island terminates at the Hamilton Bus Terminal on Washington Street, which is a short walk from King St. If you are already in the city, you do not need a bus at all.',
      },
      byFerry: {
        text: 'The Hamilton Ferry Terminal is on Front Street, a few minutes’ walk downhill from the studio. Commuter ferries from across the harbour arrive here throughout the day.',
      },
      parking:
        'Hamilton has metered street parking and municipal car parks around the city centre. Spaces on and around King St fill up during weekday business hours, so allow extra time if you are driving to a weekday afternoon appointment.',
      landmarks: [
        'Front Street and the Hamilton waterfront',
        'Hamilton Ferry Terminal',
        'Hamilton Bus Terminal, Washington Street',
        'City Hall and the Bermuda National Gallery',
      ],
    },
    localFaqs: [
      {
        question: 'Where exactly in Hamilton is InkSmith Studios?',
        answer:
          'InkSmith Studios is at 39 King St, on the second floor of the Ratteray Building, Hamilton HM 19. Look for the King St entrance and take the stairs to the second floor. If you are unsure, call the studio on +1 (441) 261-8532.',
      },
      {
        question: 'Is InkSmith Studios in Hamilton Parish?',
        answer:
          'No. InkSmith Studios is in the City of Hamilton, which sits within Pembroke Parish on the north side of Hamilton Harbour. Hamilton Parish is a separate parish in the east of the island near Flatts and Bailey’s Bay. Navigate to Hamilton HM 19, not Hamilton Parish.',
      },
      {
        question: 'Can I walk in without an appointment in Hamilton?',
        answer:
          'Yes, walk-ins are welcome at 39 King St during studio hours, which are Monday to Saturday 12:00 PM to 8:00 PM and Sunday 11:00 AM to 7:00 PM. Whether you are seen depends on which artists are free, so calling ahead on +1 (441) 261-8532 saves a wasted trip.',
      },
      {
        question: 'Where can I park near the studio?',
        answer:
          'There is metered street parking and municipal car park space around central Hamilton. Weekday business hours are the busiest, so arrive early for an afternoon appointment or consider the bus or ferry, both of which terminate within a few minutes’ walk of King St.',
      },
    ],
    serviceSlugs: ['tattoo', 'piercing', 'consultation'],
    nearbyAreaSlugs: ['pembroke', 'paget', 'devonshire'],
  },
  {
    slug: 'pembroke',
    name: 'Pembroke',
    designation: 'Pembroke Parish',
    isStudioLocation: false,
    answer:
      'Pembroke Parish surrounds the City of Hamilton, so InkSmith Studios at 39 King St is the closest tattoo and piercing studio for Pembroke residents — a few minutes by road from most of the parish and walkable from the parts nearest the city.',
    metaTitle: 'Tattoo & Piercing for Pembroke, Bermuda',
    metaDescription:
      'Pembroke residents are minutes from InkSmith Studios at 39 King St, Hamilton. Custom tattoos and body piercing, walk-ins welcome, free consultations.',
    intro: [
      'Pembroke is the parish that wraps around the City of Hamilton, running from the harbour up over the hill to the north shore. If you live in Pembroke, the studio is effectively your local — 39 King St sits inside the city boundary, which is itself inside Pembroke.',
      'That proximity changes what is practical. From Spanish Point, Mills Creek or the north shore stretch, an appointment at the studio is a short ride rather than a journey, which makes Pembroke the easiest parish to book a same-week slot from, or to drop into as a walk-in during studio hours.',
      'It also means Pembroke clients are best placed to use the free consultation properly. When a consultation costs nothing and the studio is ten minutes away, there is no reason to commit to a design before sitting down with an artist and talking through placement and sizing in person.',
      'Worth knowing if you are giving someone directions: the studio is in the City of Hamilton, which sits inside Pembroke Parish but is administered separately as a municipality. The postcode is HM 19, and the entrance is on King St itself rather than around the back of the Ratteray Building.',
    ],
    travel: {
      summary:
        'Pembroke surrounds Hamilton, so the studio is a short ride from anywhere in the parish and walkable from the areas closest to the city.',
      byCar: {
        text: 'Most of Pembroke is within a few minutes of King St. Coming from the north shore, drop down into the city and approach King St from Church Street or Reid Street.',
        approxMinutes: 10,
      },
      byBus: {
        text: 'Buses running along the north shore and through Pembroke terminate at the Hamilton Bus Terminal on Washington Street, a short walk from the studio.',
      },
      byScooter:
        'A scooter is the quickest option from Pembroke. The island-wide 35 km/h speed limit applies here as everywhere, so allow a little more time than the distance suggests.',
      parking:
        'If you drive in from Pembroke, city parking is metered and busiest during weekday business hours. Evening appointments are considerably easier for parking.',
      landmarks: [
        'Spanish Point',
        'Admiralty House Park',
        'Bernard Park',
        'The north shore road',
      ],
    },
    localFaqs: [
      {
        question: 'How far is InkSmith Studios from Pembroke?',
        answer:
          'InkSmith Studios is inside the City of Hamilton, which sits within Pembroke Parish, so it is generally under ten minutes by road from anywhere in Pembroke and walkable from the areas bordering the city. The address is 39 King St, Hamilton HM 19.',
      },
      {
        question: 'Can I walk to the studio from Pembroke?',
        answer:
          'From the parts of Pembroke closest to the city, around Cedar Avenue and the streets just north of the city boundary, 39 King St is an easy walk. From Spanish Point or the far north shore, a bus, scooter or car is more realistic.',
      },
      {
        question: 'Do I need an appointment coming from Pembroke?',
        answer:
          'Not necessarily. Walk-ins are welcome during studio hours, and Pembroke is close enough that dropping in is practical. Availability still depends on which artists are free, so booking online or calling +1 (441) 261-8532 guarantees the slot.',
      },
    ],
    serviceSlugs: ['tattoo', 'piercing', 'consultation'],
    nearbyAreaSlugs: ['hamilton', 'devonshire', 'paget'],
  },
  {
    slug: 'paget',
    name: 'Paget',
    designation: 'Paget Parish',
    isStudioLocation: false,
    answer:
      'Paget sits directly across Hamilton Harbour from the City of Hamilton, so Paget residents reach InkSmith Studios at 39 King St either by the commuter ferry across the harbour or by road around it. Both are short trips.',
    metaTitle: 'Tattoo & Piercing for Paget, Bermuda',
    metaDescription:
      'Paget is a short ferry or road trip from InkSmith Studios at 39 King St, Hamilton. Custom tattoos and body piercing, free consultations, walk-ins welcome.',
    intro: [
      'Paget faces the City of Hamilton across the harbour. That geography gives Paget clients something no other parish has in quite the same way: a genuine choice between water and road, where the water is often faster.',
      'The commuter ferry across Hamilton Harbour lands at the Hamilton Ferry Terminal on Front Street, a few minutes on foot from 39 King St — downhill on the way in, uphill on the way back. For an evening appointment it is worth checking the last sailing before committing to the ferry both ways, since the timetable thins out later in the day.',
      'By road, Paget connects to Hamilton around the head of the harbour, with Harbour Road running along the waterfront and the city in view for most of it. Either way Paget is one of the shortest journeys to the studio of any parish outside Pembroke, which makes it practical to come in for a free consultation first and book the session separately.',
    ],
    travel: {
      summary:
        'Paget lies directly across Hamilton Harbour from the studio, reachable by commuter ferry to Front Street or by road around the head of the harbour.',
      byFerry: {
        text: 'The commuter ferry across Hamilton Harbour serves Paget and lands at the Hamilton Ferry Terminal on Front Street, a few minutes from King St. Check the timetable for the last return sailing if you have a late appointment.',
      },
      byCar: {
        text: 'By road, Paget connects to Hamilton around the head of the harbour. Harbour Road and Middle Road both feed into the city.',
        approxMinutes: 15,
      },
      byBus: {
        text: 'Buses serving Paget along Middle Road and South Road run into the Hamilton Bus Terminal on Washington Street, close to the studio.',
      },
      byScooter:
        'A scooter around the harbour is straightforward, though the 35 km/h island speed limit means the road route takes longer than the map distance suggests.',
      landmarks: [
        'Hamilton Harbour and Harbour Road',
        'Elbow Beach',
        'The Bermuda Botanical Gardens',
        'Paget Marsh',
      ],
    },
    localFaqs: [
      {
        question: 'Is the ferry or the road faster from Paget to the studio?',
        answer:
          'The ferry across Hamilton Harbour is often quicker, because it crosses straight over while the road goes around. It lands at the Hamilton Ferry Terminal on Front Street, a few minutes on foot from 39 King St. Check the last return sailing before booking a late appointment.',
      },
      {
        question: 'How long does it take to get from Paget to InkSmith Studios?',
        answer:
          'Allow roughly fifteen minutes by road around the harbour, or the length of the harbour crossing plus a short walk if you take the ferry. Bermuda has an island-wide 35 km/h speed limit, so road journeys take longer than the distance implies.',
      },
      {
        question: 'Can I get to the studio from Paget without a car?',
        answer:
          'Yes. The commuter ferry lands at Front Street a few minutes from 39 King St, and buses serving Paget terminate at the Hamilton Bus Terminal on Washington Street. Neither needs a car, which matters in Bermuda since visitors cannot rent one.',
      },
    ],
    serviceSlugs: ['tattoo', 'piercing', 'consultation'],
    nearbyAreaSlugs: ['warwick', 'hamilton', 'devonshire'],
  },
  {
    slug: 'warwick',
    name: 'Warwick',
    designation: 'Warwick Parish',
    isStudioLocation: false,
    answer:
      'Warwick Parish lies on the south shore west of Paget, and Warwick residents reach InkSmith Studios at 39 King St in Hamilton by road along Middle Road or South Road, or by taking the harbour ferry from the Warwick side across to Front Street.',
    metaTitle: 'Tattoo & Piercing for Warwick, Bermuda',
    metaDescription:
      'Warwick residents reach InkSmith Studios at 39 King St, Hamilton by road or harbour ferry. Custom tattoos and body piercing, free consultations.',
    intro: [
      'Warwick runs across the waist of the island between the south shore beaches and Hamilton Harbour, which means Warwick residents have two quite different routes into the city depending on which side of the parish they live on.',
      'From the harbour side, the commuter ferry crosses to the Hamilton Ferry Terminal on Front Street, leaving a short walk uphill to 39 King St. From the south shore side, the road route along South Road or Middle Road runs east through Paget and around the head of the harbour into the city.',
      'The Railway Trail also runs through Warwick along the route of the island’s old railway, which is worth knowing if you are on a scooter or on foot and want to avoid the main roads for part of the journey. Whichever route you take, allow more time than the distance suggests — the 35 km/h island-wide speed limit means nothing in Bermuda is as quick as the map makes it look.',
      'For a first tattoo, or a larger piece that needs more than one sitting, Warwick is close enough that splitting the work across sessions is realistic rather than a chore. Raise it at the free consultation, since how a design is staged affects both the healing and the final result.',
    ],
    travel: {
      summary:
        'Warwick spans the island between the south shore and Hamilton Harbour, so both the harbour ferry and the Middle Road or South Road route into the city are practical.',
      byCar: {
        text: 'Head east on South Road or Middle Road through Paget and around the head of Hamilton Harbour into the city. Approach King St from Church Street or Reid Street.',
        approxMinutes: 20,
      },
      byFerry: {
        text: 'The commuter ferry across Hamilton Harbour serves the Warwick side of the harbour and lands at the Hamilton Ferry Terminal on Front Street, a few minutes from the studio.',
      },
      byBus: {
        text: 'Buses along South Road and Middle Road run east into the Hamilton Bus Terminal on Washington Street, a short walk from King St.',
      },
      byScooter:
        'A scooter along Middle Road is the most common way in. The Railway Trail offers a quieter alternative for part of the route through Warwick.',
      landmarks: [
        'Warwick Long Bay',
        'The Railway Trail through Warwick',
        'Khyber Pass',
        'Belmont Hills',
      ],
    },
    localFaqs: [
      {
        question: 'How long is the journey from Warwick to the studio?',
        answer:
          'Allow around twenty minutes by road from most of Warwick to 39 King St in Hamilton, going east along South Road or Middle Road through Paget. From the harbour side of the parish the commuter ferry to Front Street can be faster than driving around.',
      },
      {
        question: 'Which route is best from the south shore side of Warwick?',
        answer:
          'From the south shore, South Road east through Paget and around the head of Hamilton Harbour is the direct route into the city. If you are closer to the harbour side of Warwick, the commuter ferry across to Front Street is usually the quicker option.',
      },
      {
        question: 'Can I use the Railway Trail to get to Hamilton from Warwick?',
        answer:
          'The Railway Trail runs through Warwick along the old railway route and is useful for avoiding the main roads on part of the journey, but it does not run all the way to the studio door. Plan to join Middle Road or South Road for the final stretch into the city.',
      },
    ],
    serviceSlugs: ['tattoo', 'piercing', 'consultation'],
    nearbyAreaSlugs: ['paget', 'southampton', 'hamilton'],
  },
  {
    slug: 'devonshire',
    name: 'Devonshire',
    designation: 'Devonshire Parish',
    isStudioLocation: false,
    answer:
      'Devonshire Parish borders Pembroke immediately east of the City of Hamilton, so InkSmith Studios at 39 King St is one of the shortest journeys on the island for Devonshire residents — typically ten to fifteen minutes by road along the north shore or Middle Road.',
    metaTitle: 'Tattoo & Piercing for Devonshire, Bermuda',
    metaDescription:
      'Devonshire is ten to fifteen minutes from InkSmith Studios at 39 King St, Hamilton. Custom tattoos and body piercing, free consultations, walk-ins welcome.',
    intro: [
      'Devonshire sits directly east of Pembroke, which puts it within easy reach of the City of Hamilton without being inside it. For most of the parish, getting to 39 King St is a ten to fifteen minute run west along either the north shore or Middle Road.',
      'Devonshire is one of the greener, more residential parishes — Devonshire Marsh sits in the middle of it and much of the parish is agricultural rather than built up. That means fewer through-routes than Pembroke, and the practical consequence is that your route depends on whether you live north or south of the marsh.',
      'For a client from Devonshire, the short journey makes the two-visit approach easy: come in for a free consultation, take away the design conversation, then book the session for a separate day. That is generally a better way to end up with a tattoo you are happy with than trying to decide everything in one sitting.',
      'The same logic applies to piercings. Because aftercare runs for months rather than weeks, around two for titanium jewellery and around six for stainless steel, being fifteen minutes from the studio makes it straightforward to come back if something does not look right partway through healing.',
    ],
    travel: {
      summary:
        'Devonshire borders Pembroke to the east, so the studio is a ten to fifteen minute run west along the north shore or Middle Road.',
      byCar: {
        text: 'Head west into Hamilton on North Shore Road or Middle Road depending on which side of Devonshire Marsh you start from, then approach King St from Church Street or Reid Street.',
        approxMinutes: 15,
      },
      byBus: {
        text: 'Buses along the north shore and Middle Road run west into the Hamilton Bus Terminal on Washington Street, a short walk from the studio.',
      },
      byScooter:
        'A scooter west along North Shore Road or Middle Road is the usual route. Remember the 35 km/h island-wide speed limit when estimating your travel time.',
      parking:
        'City parking is metered and busiest during weekday business hours, so an evening appointment is easier if you are driving in.',
      landmarks: [
        'Devonshire Marsh',
        'Palmetto Park',
        'North Shore Road',
        'The Arboretum',
      ],
    },
    localFaqs: [
      {
        question: 'How long does it take to get from Devonshire to InkSmith Studios?',
        answer:
          'Allow ten to fifteen minutes by road from most of Devonshire to 39 King St in Hamilton, heading west along North Shore Road or Middle Road. Bermuda has an island-wide 35 km/h speed limit, so the trip takes slightly longer than the short distance implies.',
      },
      {
        question: 'Which road should I take from Devonshire?',
        answer:
          'It depends which side of Devonshire Marsh you start from. North of the marsh, North Shore Road runs directly west into Hamilton. South of it, Middle Road is the more natural route. Both feed into the city within a few minutes of King St.',
      },
      {
        question: 'Is it worth booking ahead from Devonshire?',
        answer:
          'Devonshire is close enough that a walk-in during studio hours is practical, but availability depends on which artists are free that day. Booking online or calling +1 (441) 261-8532 avoids a wasted trip, which matters even on a short journey.',
      },
    ],
    serviceSlugs: ['tattoo', 'piercing', 'consultation'],
    nearbyAreaSlugs: ['pembroke', 'smiths', 'hamilton'],
  },
  {
    slug: 'smiths',
    name: "Smith's",
    designation: "Smith's Parish",
    isStudioLocation: false,
    answer:
      "Smith's Parish sits east of Devonshire around Harrington Sound and Flatts Village, and residents reach InkSmith Studios at 39 King St in Hamilton by heading west along North Shore Road or South Road — generally a twenty minute journey.",
    metaTitle: "Tattoo & Piercing for Smith's, Bermuda",
    metaDescription:
      "Smith's Parish residents reach InkSmith Studios at 39 King St, Hamilton in around twenty minutes. Custom tattoos, body piercing and free consultations.",
    intro: [
      "Smith's Parish occupies the middle-east of the island, wrapping around the western side of Harrington Sound and taking in Flatts Village on the north shore. It is one of the quieter parishes, and its clients tend to plan appointments rather than drop in, simply because the journey is long enough to be worth planning.",
      'From Flatts, the north shore road runs west through Devonshire and into Hamilton. From the south side of the parish, South Road takes you along the coast past Spittal Pond and on towards the city. Both routes converge on the same destination: 39 King St, on the second floor of the Ratteray Building.',
      'Twenty minutes each way is enough that a wasted trip stings, so booking online or calling ahead is worth the two minutes it takes. The upside is that the free consultation is genuinely free, so there is no cost to making the trip once to talk through a design before committing to a session.',
    ],
    travel: {
      summary:
        "Smith's sits east of Devonshire around Harrington Sound, roughly twenty minutes west into Hamilton by North Shore Road or South Road.",
      byCar: {
        text: 'From Flatts and the north of the parish, take North Shore Road west through Devonshire into the city. From the south, South Road runs west past Spittal Pond towards Hamilton.',
        approxMinutes: 20,
      },
      byBus: {
        text: 'Buses running west along the north shore through Flatts, and along South Road, both terminate at the Hamilton Bus Terminal on Washington Street near the studio.',
      },
      byScooter:
        'A scooter west along North Shore Road is the common route. At the island-wide 35 km/h limit, allow a full twenty minutes rather than judging by distance.',
      landmarks: [
        'Flatts Village',
        'Harrington Sound',
        'Spittal Pond Nature Reserve',
        'John Smith’s Bay',
      ],
    },
    localFaqs: [
      {
        question: "How do I get to the studio from Flatts or Smith's Parish?",
        answer:
          "From Flatts, take North Shore Road west through Devonshire into the City of Hamilton, then approach King St from Church Street or Reid Street. From the south of Smith's, South Road runs west past Spittal Pond. Allow around twenty minutes either way.",
      },
      {
        question: "Should I book ahead from Smith's rather than walk in?",
        answer:
          "Booking ahead is worth it from Smith's. Walk-ins are welcome during studio hours, but at roughly twenty minutes each way a wasted trip is a real cost. Book online or call +1 (441) 261-8532 to confirm an artist is free.",
      },
      {
        question: "Is there parking near the studio if I drive from Smith's?",
        answer:
          'Central Hamilton has metered street parking and municipal car parks. Weekday business hours are busiest, so if you are driving in from the east consider an evening appointment, when both the roads and the parking are easier.',
      },
    ],
    serviceSlugs: ['tattoo', 'piercing', 'consultation'],
    nearbyAreaSlugs: ['devonshire', 'st-georges', 'hamilton'],
  },
  {
    slug: 'st-georges',
    name: "St. George's",
    designation: "St. George's Parish",
    isStudioLocation: false,
    answer:
      "St. George's is at the eastern end of Bermuda, making it the longest journey to InkSmith Studios at 39 King St in Hamilton — allow around forty-five minutes by road along the north shore, or longer by bus.",
    metaTitle: "Tattoo & Piercing for St. George's, Bermuda",
    metaDescription:
      "St. George's residents travel around forty-five minutes to InkSmith Studios at 39 King St, Hamilton. Custom tattoos and body piercing — book ahead.",
    intro: [
      "St. George's Parish covers the eastern end of the island, including the UNESCO-listed Town of St. George and St. David's Island. It is the furthest parish from the studio, and that distance genuinely changes how you should approach an appointment.",
      "The road route runs west along the north shore through Hamilton Parish, Smith's and Devonshire before reaching the City of Hamilton. At Bermuda's island-wide 35 km/h speed limit, that is around forty-five minutes by car or scooter and longer by bus, since buses stop frequently along the way.",
      "For a client from St. George's, the sensible approach is to do as much as possible in one visit and to book firmly rather than turning up. Send your reference images through the booking form in advance so the artist has seen your concept before you arrive, then use the visit itself for the consultation and, where the design is straightforward enough, the session. Anything that avoids a second forty-five minute trip is worth doing.",
    ],
    travel: {
      summary:
        "St. George's is the furthest parish from the studio, around forty-five minutes west along the north shore into Hamilton.",
      byCar: {
        text: "Head west out of St. George's and follow the north shore route through Hamilton Parish, Smith's and Devonshire into the City of Hamilton. Approach King St from Church Street or Reid Street.",
        approxMinutes: 45,
      },
      byBus: {
        text: "Buses run between St. George's and the Hamilton Bus Terminal on Washington Street throughout the day. Allow noticeably longer than the car journey, since buses stop frequently along the north shore.",
      },
      byScooter:
        "A scooter takes roughly the same time as a car given the 35 km/h limit. It is a long ride in poor weather, so check the forecast before committing to it for an evening appointment.",
      landmarks: [
        'Town of St. George',
        "St. David's Island",
        'Ferry Reach',
        'Tobacco Bay',
      ],
    },
    localFaqs: [
      {
        question: "How long does it take to get from St. George's to the studio?",
        answer:
          "Allow around forty-five minutes by car or scooter from St. George's to 39 King St in Hamilton, following the north shore route west. By bus, allow longer — buses stop frequently along the way. Bermuda's 35 km/h island-wide speed limit applies for the whole journey.",
      },
      {
        question: "Is it worth travelling from St. George's for a consultation?",
        answer:
          "Consultations at InkSmith Studios are free, but at forty-five minutes each way it is worth making one trip do more. Submit your concept and reference images through the booking form beforehand so the artist has already seen them, then use the visit for the consultation and, where possible, the session itself.",
      },
      {
        question: "Should I book rather than walk in from St. George's?",
        answer:
          "Yes. Walk-ins are welcome, but from St. George's the risk of arriving when no artist is free is not worth taking. Book online or call +1 (441) 261-8532 to confirm your slot before setting off.",
      },
      {
        question: 'Do you have a studio closer to the east end?',
        answer:
          'No. InkSmith Studios operates a single studio, at 39 King St, 2nd Floor, Ratteray Bldg., Hamilton HM 19. All tattooing and piercing is done there — the studio does not travel to clients or run a second location.',
      },
    ],
    serviceSlugs: ['tattoo', 'piercing', 'consultation'],
    nearbyAreaSlugs: ['smiths', 'devonshire', 'hamilton'],
  },
  {
    slug: 'southampton',
    name: 'Southampton',
    designation: 'Southampton Parish',
    isStudioLocation: false,
    answer:
      'Southampton Parish runs along the south-west of the island, and residents reach InkSmith Studios at 39 King St in Hamilton in roughly twenty-five to thirty minutes by road east along Middle Road or South Road.',
    metaTitle: 'Tattoo & Piercing for Southampton, Bermuda',
    metaDescription:
      'Southampton is around thirty minutes from InkSmith Studios at 39 King St, Hamilton. Custom tattoos, body piercing and free consultations, open seven days.',
    intro: [
      'Southampton stretches along the south-west of Bermuda, taking in the south shore beaches and rising to Gibbs Hill, where the lighthouse gives the parish its most recognisable landmark. It is far enough west that a trip to the studio is a proper outing rather than an errand.',
      'The road east into Hamilton runs through Warwick and Paget along either Middle Road or South Road, and the two are genuinely different drives — South Road hugs the coast, Middle Road runs through the centre. Neither is dramatically faster, so take whichever suits where in the parish you start from.',
      'At roughly twenty-five to thirty minutes each way, Southampton clients get the most out of booking ahead and using the online form to send reference images before the appointment. That way the consultation starts with the artist already knowing what you have in mind, rather than starting from a blank page after you have just spent half an hour on the road.',
    ],
    travel: {
      summary:
        'Southampton lies south-west of the city, roughly twenty-five to thirty minutes east into Hamilton by Middle Road or South Road.',
      byCar: {
        text: 'Head east through Warwick and Paget on Middle Road or South Road, around the head of Hamilton Harbour and into the city.',
        approxMinutes: 30,
      },
      byBus: {
        text: 'Buses running east along South Road and Middle Road terminate at the Hamilton Bus Terminal on Washington Street, a short walk from King St.',
      },
      byFerry: {
        text: 'Seasonal ferry services call at points along the south-west of the island. Check the current timetable before relying on one, as sailings vary through the year.',
      },
      byScooter:
        'A scooter east along Middle Road is the usual route. At the island-wide 35 km/h limit, allow a full half hour and factor in the weather on the exposed south shore stretch.',
      landmarks: [
        'Gibbs Hill Lighthouse',
        'Horseshoe Bay',
        'Church Bay',
        'The Railway Trail through Southampton',
      ],
    },
    localFaqs: [
      {
        question: 'How long is the trip from Southampton to InkSmith Studios?',
        answer:
          'Allow roughly twenty-five to thirty minutes by road from Southampton to 39 King St in Hamilton, heading east through Warwick and Paget. The island-wide 35 km/h speed limit means the journey takes longer than the distance suggests.',
      },
      {
        question: 'Middle Road or South Road from Southampton?',
        answer:
          'Neither is dramatically faster. South Road follows the coast and Middle Road runs through the centre of the island, and both converge into Hamilton around the head of the harbour. Take whichever is closer to where in Southampton you are starting.',
      },
      {
        question: 'Can I send my design ideas before travelling from Southampton?',
        answer:
          'Yes, and it is worth doing. The booking form accepts a reference image in JPG, PNG or PDF up to 15MB, so your artist can see your concept before you arrive. That makes a single visit from Southampton far more productive.',
      },
    ],
    serviceSlugs: ['tattoo', 'piercing', 'consultation'],
    nearbyAreaSlugs: ['warwick', 'sandys', 'paget'],
  },
  {
    slug: 'sandys',
    name: 'Sandys',
    designation: 'Sandys Parish',
    isStudioLocation: false,
    answer:
      'Sandys Parish covers the far west of Bermuda, including Somerset Village and the Royal Naval Dockyard. Residents reach InkSmith Studios at 39 King St in Hamilton either by the Dockyard ferry across the Great Sound, which is usually the fastest option, or by road east through Southampton.',
    metaTitle: 'Tattoo & Piercing for Sandys, Bermuda',
    metaDescription:
      'Sandys residents reach InkSmith Studios at 39 King St, Hamilton by Dockyard ferry or road. Custom tattoos, body piercing and free consultations.',
    intro: [
      'Sandys is the westernmost parish, taking in Somerset Village, Somerset Bridge and the Royal Naval Dockyard at the tip of the island. It is a long way round by road, and that is precisely why the ferry matters here more than anywhere else.',
      'The ferry from Dockyard runs across the Great Sound directly to the Hamilton Ferry Terminal on Front Street, a few minutes on foot from 39 King St. Cutting straight across the water avoids the long road route east through Southampton, Warwick and Paget, and for most of Sandys it is both faster and considerably more pleasant.',
      'If you do drive or ride, the road east is a genuine journey — allow well over half an hour at the island-wide 35 km/h limit. Whichever way you come, book ahead and send your reference images through the booking form first. From the west end, a single well-prepared visit is worth far more than two speculative ones.',
      'One practical warning about the ferry route: studio hours run to 8:00 PM Monday to Saturday, and sailings back to Dockyard thin out well before then. Check the last crossing before booking an evening slot, or plan on taking the road home.',
    ],
    travel: {
      summary:
        'Sandys covers the far west, with the Dockyard ferry across the Great Sound usually beating the long road route east into Hamilton.',
      byFerry: {
        text: 'The ferry from the Royal Naval Dockyard crosses the Great Sound to the Hamilton Ferry Terminal on Front Street, a few minutes from the studio. Check the current timetable, and note the last return sailing before booking a late appointment.',
      },
      byCar: {
        text: 'By road, head east through Southampton, Warwick and Paget on Middle Road or South Road, then around the head of Hamilton Harbour into the city. It is a long run at the island speed limit.',
        approxMinutes: 40,
      },
      byBus: {
        text: 'Buses run between the west end and the Hamilton Bus Terminal on Washington Street. Allow longer than the ferry, since the road route is long and buses stop frequently.',
      },
      byScooter:
        'A scooter east is possible but it is a long ride in each direction. Many west end residents take the scooter to Dockyard and the ferry across instead.',
      landmarks: [
        'Royal Naval Dockyard',
        'Somerset Village',
        'Somerset Bridge',
        'The Railway Trail through Somerset',
      ],
    },
    localFaqs: [
      {
        question: 'What is the fastest way from Sandys to InkSmith Studios?',
        answer:
          'The ferry from the Royal Naval Dockyard across the Great Sound to the Hamilton Ferry Terminal on Front Street is usually fastest, leaving a few minutes on foot to 39 King St. The road route east through Southampton, Warwick and Paget takes considerably longer.',
      },
      {
        question: 'How long does the road journey from Somerset take?',
        answer:
          'Allow forty minutes or more by road from Somerset to 39 King St in Hamilton, heading east through Southampton, Warwick and Paget. Bermuda has an island-wide 35 km/h speed limit, so there is no way to shorten it much.',
      },
      {
        question: 'Can I take the ferry back after an evening appointment?',
        answer:
          'Check the current ferry timetable before you rely on it. Sailings thin out later in the day and vary through the year, so confirm the last return crossing to Dockyard before booking an appointment near the end of studio hours, which run to 8:00 PM Monday to Saturday.',
      },
    ],
    serviceSlugs: ['tattoo', 'piercing', 'consultation'],
    nearbyAreaSlugs: ['southampton', 'warwick', 'hamilton'],
  },
];

/* ─────────────────────────────── selectors ────────────────────────── */

const bySlug = new Map(serviceAreas.map((area) => [area.slug, area]));

export function getServiceArea(slug: string): ServiceArea | undefined {
  return bySlug.get(slug);
}

export function serviceAreaSlugs(): string[] {
  return serviceAreas.map((area) => area.slug);
}

/** Every area name, for `areaServed` in the business schema. */
export function serviceAreaNames(): string[] {
  return serviceAreas.map((area) => area.name);
}

/** The single parish the studio physically occupies. */
export function studioArea(): ServiceArea | undefined {
  return serviceAreas.find((area) => area.isStudioLocation);
}

export function nearbyAreas(area: ServiceArea): ServiceArea[] {
  return area.nearbyAreaSlugs
    .map((slug) => bySlug.get(slug))
    .filter(Boolean) as ServiceArea[];
}
