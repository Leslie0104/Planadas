/* =========================================================
   IDIOMAS · Español / English
   El HTML está escrito en español. Este archivo traduce cada
   fragmento de texto y atributo usando el diccionario EN.
   Para cambiar una traducción, edita el texto a la derecha.
   Para agregar un texto nuevo al sitio, añade aquí su línea.
   ========================================================= */
window.I18N = (function () {
  'use strict';

  /* ---------- textos generados por JavaScript ---------- */
  const STR = {
    es: {
      'sound.on': 'Sonido activo', 'sound.off': 'Sonido apagado',
      'scene.forest': 'Mirlas del bosque de niebla', 'scene.plaza': 'Campanas del parque',
      'scene.wind': 'Viento de cordillera', 'scene.river': 'Quebrada de montaña',
      'scene.strings': '«Ingrata» · Jorge Áñez, 1922', 'scene.fire': 'Fogón de leña', 'scene.none': 'Película',
      'film.play': 'Escuchar la película', 'film.mute': 'Silenciar la película',
      'dir.W': 'O',
      'mail.name': 'Nombre', 'mail.email': 'Correo', 'mail.date': 'Fecha', 'mail.people': 'Personas',
      'mail.interests': 'Intereses', 'mail.subject': 'Quiero visitar Planadas',
      'wx.local': 'hora local', 'wx.now': 'Hoy', 'wx.today': 'Hoy', 'wx.rainShort': 'lluvia', 'wx.chip': 'en Planadas',
      'wx.error': 'Clima no disponible por ahora', 'wx.loading': 'Cargando el clima…',
      'wx.0': 'Despejado', 'wx.1': 'Mayormente despejado', 'wx.2': 'Parcialmente nublado', 'wx.3': 'Nublado',
      'wx.45': 'Niebla', 'wx.48': 'Niebla con escarcha', 'wx.51': 'Llovizna ligera', 'wx.53': 'Llovizna', 'wx.55': 'Llovizna intensa',
      'wx.56': 'Llovizna helada', 'wx.57': 'Llovizna helada', 'wx.61': 'Lluvia ligera', 'wx.63': 'Lluvia', 'wx.65': 'Lluvia fuerte',
      'wx.66': 'Lluvia helada', 'wx.67': 'Lluvia helada', 'wx.80': 'Chubascos ligeros', 'wx.81': 'Chubascos', 'wx.82': 'Chubascos fuertes',
      'wx.95': 'Tormenta eléctrica', 'wx.96': 'Tormenta con granizo', 'wx.99': 'Tormenta con granizo', 'wx.snow': 'Nieve'
    },
    en: {
      'sound.on': 'Sound on', 'sound.off': 'Sound off',
      'scene.forest': 'Thrushes of the cloud forest', 'scene.plaza': 'Bells on the square',
      'scene.wind': 'Mountain wind', 'scene.river': 'Mountain stream',
      'scene.strings': '“Ingrata” · Jorge Áñez, 1922', 'scene.fire': 'Wood fire', 'scene.none': 'Film',
      'film.play': 'Play film sound', 'film.mute': 'Mute film',
      'dir.W': 'W',
      'mail.name': 'Name', 'mail.email': 'Email', 'mail.date': 'Date', 'mail.people': 'People',
      'mail.interests': 'Interests', 'mail.subject': 'I want to visit Planadas',
      'wx.local': 'local time', 'wx.now': 'Now', 'wx.today': 'Today', 'wx.rainShort': 'rain', 'wx.chip': 'in Planadas',
      'wx.error': 'Weather unavailable right now', 'wx.loading': 'Loading weather…',
      'wx.0': 'Clear sky', 'wx.1': 'Mostly clear', 'wx.2': 'Partly cloudy', 'wx.3': 'Overcast',
      'wx.45': 'Fog', 'wx.48': 'Freezing fog', 'wx.51': 'Light drizzle', 'wx.53': 'Drizzle', 'wx.55': 'Heavy drizzle',
      'wx.56': 'Freezing drizzle', 'wx.57': 'Freezing drizzle', 'wx.61': 'Light rain', 'wx.63': 'Rain', 'wx.65': 'Heavy rain',
      'wx.66': 'Freezing rain', 'wx.67': 'Freezing rain', 'wx.80': 'Light showers', 'wx.81': 'Showers', 'wx.82': 'Heavy showers',
      'wx.95': 'Thunderstorm', 'wx.96': 'Thunderstorm with hail', 'wx.99': 'Thunderstorm with hail', 'wx.snow': 'Snow'
    }
  };

  /* ---------- textos del HTML: español → inglés ---------- */
  const EN = {
    // cabecera, carga y navegación
    'Planadas · Tolima, Colombia — Café de origen': 'Planadas · Tolima, Colombia — Origin coffee',
    'Planadas, sur del Tolima, Colombia. Rutas cafeteras, cultura Nasa, cocina tolimense y experiencias comunitarias en la Cordillera Central.':
      'Planadas, southern Tolima, Colombia. Coffee routes, Nasa culture, Tolima cuisine and community experiences in the Central Andes.',
    'Sur del Tolima · República de Colombia': 'Southern Tolima · Republic of Colombia',
    'm s.n.m.': 'm a.s.l.',
    'Entrar con sonido': 'Enter with sound',
    'o': 'or',
    'en silencio': 'in silence',
    'La montaña se escucha mejor con audífonos': 'The mountain sounds better with headphones',
    '75°39′ O': '75°39′ W',
    '3°11′ N · 75°39′ O': '3°11′ N · 75°39′ W',
    '3°11′ N — 75°39′ O': '3°11′ N — 75°39′ W',
    'Planear visita': 'Plan a visit',
    'Índice': 'Index',
    'Cerrar': 'Close',
    'Índice del viaje': 'Journey index',
    'Inicio': 'Home',
    'La montaña': 'The mountain',
    'Parque central': 'Main square',
    'El corazón': 'The heart',
    'Rutas cafeteras': 'Coffee routes',
    'Cuatro caminos': 'Four paths',
    'Cultura': 'Culture',
    'Memoria viva': 'Living memory',
    'Comida': 'Food',
    'La carta': 'The menu',
    'Experiencias comunitarias': 'Community experiences',
    'Con la gente': 'With the people',
    'Eventos': 'Events',
    'Almanaque': 'Almanac',
    'Mapa': 'Map',
    'Cómo llegar': 'Getting here',
    'Planea tu viaje': 'Plan your trip',
    'Clima y consejos': 'Weather & tips',
    'Contacto': 'Contact',
    'Escríbenos': 'Write to us',
    'Cordillera Central de los Andes': 'Central Andes range',
    'Sonido apagado': 'Sound off',
    'Bosque de niebla': 'Cloud forest',
    'Logo de Planadas: café, naturaleza, personas': 'Planadas logo: coffee, nature, people',
    'Planadas — café, naturaleza, personas': 'Planadas — coffee, nature, people',
    'Activar o silenciar el sonido ambiente': 'Turn ambient sound on or off',
    'Índice del sitio': 'Site index',

    // inicio
    'Sur del Tolima — Cordillera Central — Colombia': 'Southern Tolima — Central Andes — Colombia',
    'donde la montaña': 'where the mountain',
    'se sirve en taza': 'is served in a cup',
    'Desciende': 'Scroll down',
    'Cafetales al amanecer': 'Coffee fields at dawn',

    // globo
    'Del mundo a Planadas': 'From the world to Planadas',
    'Globo terráqueo que se acerca hasta Planadas, Tolima, Colombia': 'Globe zooming in on Planadas, Tolima, Colombia',
    'Latitud': 'Latitude',
    'Longitud': 'Longitude',
    'Altura de vista': 'View altitude',
    'Capítulo cero': 'Chapter zero',
    'Un planeta.': 'One planet.',
    'Un grano.': 'One bean.',
    'Hemisferio occidental': 'Western hemisphere',
    'Sudamérica,': 'South America,',
    'donde nace el café suave': 'where mild coffee is born',
    'República de': 'Republic of',
    'Departamento del': 'Department of',
    'Cordillera Central': 'Central Andes',
    'La capital cafetera del sur del Tolima': 'The coffee capital of southern Tolima',

    // manifiesto
    'Manifiesto': 'Manifesto',
    'Manos recolectando': 'Hands picking coffee',
    'Granos en el secadero': 'Beans on the drying bed',
    'Altura de los cafetales': 'Coffee farm altitude',
    'Clima de la cabecera': 'Town climate',
    'Pueblos que lo habitan': 'Who lives here',
    'Campesino': 'Farmers',
    'Café de altura': 'High-altitude coffee',
    'Tierra Nasa': 'Nasa land',
    'Río Atá': 'Atá River',

    // parque central
    'II · Parque central': 'II · Main square',
    'Iglesia y parque principal': 'Church and main square',
    'El Parque, corazón de Planadas': 'The Square, heart of Planadas',
    'El Parque': 'The Square',
    'corazón de Planadas': 'heart of Planadas',
    'Plaza principal': 'Main square',
    'Aquí empieza y termina todo viaje: el tinto de la mañana, el mercado del domingo, las fiestas de junio y las campanas que marcan la hora.':
      'Every journey begins and ends here: the morning coffee, the Sunday market, the June festivities and the bells that mark the hours.',
    'Galería al aire libre': 'Open-air gallery',
    'Piedra, bronce': 'Stone, bronze',
    'y memoria': 'and memory',
    'Tres monumentos cuentan quiénes fundaron el pueblo, a quién se recuerda y qué se celebra. Recórrelos despacio: cada uno tiene su historia.':
      'Three monuments tell who founded the town, who is remembered and what is celebrated. Take your time: each one has its story.',
    'Pieza I': 'Piece I',
    'Pieza II': 'Piece II',
    'Pieza III': 'Piece III',
    'Los Fundadores': 'The Founders',
    'Monumento Los Fundadores': 'The Founders monument',
    'La figura campesina con sombrero y bastón preside el Parque Los Fundadores. En su pedestal, una placa guarda los nombres de las familias que abrieron el pueblo en la montaña.':
      'The farmer figure with hat and cane presides over Los Fundadores Park. On its pedestal, a plaque keeps the names of the families who opened the town in the mountains.',
    'Lugar': 'Place',
    'Parque Los Fundadores': 'Los Fundadores Park',
    'La familia': 'The family',
    'Grupo escultórico de la familia': 'Family sculpture group',
    'Padres, abuelos e hijos abrazados en una sola pieza. Un homenaje a la familia que sostiene la vida de las veredas y de la cosecha.':
      'Parents, grandparents and children embracing in a single piece. A tribute to the families who sustain rural life and the harvest.',
    'Parque principal': 'Main square',
    'Busto a José Farid Sánchez': 'Bust of José Farid Sánchez',
    'Rodeado de árboles, el busto recuerda a un personaje querido de la historia local. Un punto de encuentro y de memoria en medio del verde.':
      'Surrounded by trees, the bust honors a beloved figure of local history. A place to meet and remember amid the green.',
    'El templo': 'The church',
    'La iglesia': 'The church',
    'del parque': 'on the square',
    'La iglesia del parque': 'The church on the square',
    'Iglesia': 'Church',
    'Su campanario rojizo y su fachada blanca se ven desde casi cualquier esquina del pueblo. Frente a ella ondea la bandera, pasan las procesiones y se reúnen las familias después de misa. Es la foto obligada de todo el que llega a Planadas.':
      'Its reddish bell tower and white façade can be seen from almost every corner of town. In front of it the flag waves, processions pass by and families gather after Mass. It is the must-have photo for everyone who arrives in Planadas.',
    'Tocar la campana': 'Ring the bell',
    'con sonido': 'with sound',
    'Un tinto en las bancas': 'A coffee on the benches',
    'Las mañanas en el parque huelen a café recién colado.': 'Mornings on the square smell of freshly brewed coffee.',
    'Domingo de mercado': 'Market Sunday',
    'Las veredas bajan con frutas, panela y café en grano.': 'Farmers come down with fruit, panela and whole-bean coffee.',
    'Atardecer desde el atrio': 'Sunset from the church steps',
    'La luz dorada sobre las montañas que rodean el pueblo.': 'Golden light over the mountains around town.',

    // rutas
    'III · Rutas cafeteras': 'III · Coffee routes',
    'hacia una taza': 'to a cup',
    'Senderos de herradura, trochas entre guamos y fincas familiares que abren su puerta. Cada ruta es un capítulo del mismo libro: la altura, el agua y las manos.':
      'Mule trails, paths among shade trees and family farms that open their doors. Each route is a chapter of the same book: altitude, water and hands.',
    'Desliza': 'Scroll',
    'Ruta I': 'Route I', 'Ruta II': 'Route II', 'Ruta III': 'Route III', 'Ruta IV': 'Route IV',
    'Ruta del Origen': 'Origin Route',
    'De la cabecera a las veredas altas: fincas donde se recolecta a mano, se despulpa con agua de quebrada y se seca al sol en marquesinas.':
      'From town up to the high villages: farms where coffee is hand-picked, pulped with stream water and sun-dried under greenhouse roofs.',
    'Altura': 'Altitude',
    'Duración': 'Duration',
    'Día completo': 'Full day',
    'Ritmo': 'Pace',
    'Suave': 'Easy',
    'Camino a Gaitania': 'The road to Gaitania',
    'Ruta de Gaitania': 'Gaitania route',
    'Hacia el corregimiento de Gaitania, territorio del pueblo Nasa, donde el café crece entre saberes ancestrales y paisajes de páramo a la vista.':
      'Toward Gaitania, land of the Nasa people, where coffee grows among ancestral knowledge with páramo landscapes in sight.',
    'Dos días': 'Two days',
    'Moderado': 'Moderate',
    'Ruta del Río Atá': 'Atá River Route',
    'Cafetales de ladera que bajan hasta el río. Charcos de agua fría, puentes colgantes y almuerzo de fogón en la orilla.':
      'Hillside coffee fields sloping down to the river. Cold pools, hanging bridges and a wood-fire lunch on the bank.',
    'Medio día': 'Half day',
    'Ruta de las Mujeres Cafeteras': 'Women Coffee Growers Route',
    'Mujeres cafeteras': 'Women coffee growers',
    'Asociaciones de productoras que tuestan, empacan y cuentan su propia historia. Termina en una mesa de cata con los lotes de la temporada.':
      'Women-led associations that roast, pack and tell their own story. It ends at a cupping table with the season’s lots.',
    'Fin del camino': 'End of the road',
    'Todas las rutas': 'Every route',
    'terminan en una taza.': 'ends in a cup.',
    'Reservar una ruta': 'Book a route',

    // película
    'Del grano a la taza': 'From bean to cup',
    'Del grano': 'From bean',
    'a la taza': 'to cup',
    'Película · Planadas, Tolima': 'Film · Planadas, Tolima',
    'Escuchar la película': 'Play film sound',
    'Silenciar la película': 'Mute film',

    // cultura
    'IV · Cultura': 'IV · Culture',
    'Memoria': 'Memory',
    'que se canta,': 'that is sung,',
    'se teje y se baila': 'woven and danced',
    'Bambuco y rajaleña': 'Bambuco and rajaleña',
    'y rajaleña': 'and rajaleña',
    'El tiple, la bandola y la guacharaca marcan el compás del sur del Tolima. La rajaleña, copla pícara e improvisada, todavía se canta en veredas y fiestas patronales.':
      'The tiple, the bandola and the guacharaca keep the beat of southern Tolima. Rajaleña, a cheeky improvised verse, is still sung in villages and patron-saint festivities.',
    'Con sonido activo suena «Ingrata», grabada en 1922 por Jorge Áñez y Alcides Briceño, pioneros de la música andina colombiana.':
      'With sound on you’ll hear “Ingrata”, recorded in 1922 by Jorge Áñez and Alcides Briceño, pioneers of Colombian Andean music.',
    'Pueblo': 'The',
    'Pueblo Nasa': 'The Nasa people',
    'En Gaitania y sus alrededores, comunidades Nasa conservan su lengua, el nasa yuwe, su medicina tradicional y una relación con el territorio que también se siente en la manera de cultivar.':
      'In and around Gaitania, Nasa communities keep their language, Nasa Yuwe, their traditional medicine and a bond with the land that shows in the way they farm.',
    'Toda visita a territorio indígena se hace con acompañamiento y permiso de la comunidad.':
      'Every visit to indigenous territory is made with the community’s guidance and permission.',
    'Tejido': 'Weaving',
    'y artesanía': 'and crafts',
    'Tejido y artesanía': 'Weaving and crafts',
    'Mochilas, chumbes y canastos de fibra natural. Piezas lentas, hechas en casa, que llevan los colores de la montaña y los símbolos de quien las teje.':
      'Mochila bags, woven sashes and natural-fiber baskets. Slow, handmade pieces that carry the colors of the mountain and the symbols of those who weave them.',
    'Fiestas': 'Festivities',
    'de San Pedro': 'of Saint Peter',
    'Fiestas de San Pedro': 'Saint Peter festivities',
    'Junio llega con reinados, cabalgatas, sanjuanero y lechona compartida. Es la temporada en que el pueblo entero sale a la plaza.':
      'June brings pageants, horseback parades, sanjuanero dancing and shared lechona. It is the season when the whole town comes out to the square.',

    // comida
    'V · Comida': 'V · Food',
    'de la montaña': 'of the mountain',
    'Cocina de fogón de leña, maíz, plátano y paciencia. Pasa el cursor sobre cada plato.':
      'Wood-fire cooking, corn, plantain and patience. Hover over each dish.',
    'Plato': 'Dish',
    'Del fogón': 'From the fire',
    'Lechona tolimense': 'Tolima lechona',
    'Plato insignia': 'Signature dish',
    'Cerdo relleno de arveja amarilla, arroz y especias, horneado toda la noche.': 'Whole pork stuffed with yellow peas, rice and spices, roasted overnight.',
    'Tamal tolimense': 'Tolima tamal',
    'Domingo': 'Sunday',
    'Envuelto en hoja de plátano, con huevo, arveja y la mejor chocolatada al lado.': 'Wrapped in plantain leaf, with egg and peas, and hot chocolate on the side.',
    'Sancocho de gallina': 'Hen sancocho',
    'Al río': 'By the river',
    'Gallina criolla, yuca, plátano y mazorca, cocinados en olla de barro.': 'Free-range hen, cassava, plantain and corn, cooked in a clay pot.',
    'Del maíz': 'From corn',
    'Envueltos de mazorca': 'Corn envueltos',
    'Tarde': 'Afternoon',
    'Maíz tierno molido, dulce y salado a la vez, en su propia hoja.': 'Ground fresh corn, sweet and savory at once, in its own husk.',
    'Arepa de maíz pelao': 'Hulled-corn arepa',
    'Desayuno': 'Breakfast',
    'Asada en tiesto, con quesillo fresco de la finca.': 'Grilled on clay, with fresh farm cheese.',
    'Dulce y compartido': 'Sweet and shared',
    'Bizcochos de achira': 'Achira biscuits',
    'Para el camino': 'For the road',
    'Crocantes, de almidón de achira y queso, horneados en horno de barro.': 'Crunchy, made of achira starch and cheese, baked in a clay oven.',
    'Insulso': 'Insulso',
    'Dulce de maíz y panela, envuelto en hoja de bijao.': 'Corn and panela sweet, wrapped in bijao leaf.',
    'En la taza': 'In the cup',
    'Café de especialidad': 'Specialty coffee',
    'Lote de temporada': 'Seasonal lot',
    'Filtrado lento, sin azúcar, para encontrar la panela y la fruta del grano.': 'Slow-brewed, no sugar, to find the panela and fruit notes of the bean.',
    'Tinto campesino': 'Farmhouse tinto',
    'Siempre': 'Always',
    'En olleta, con panela, a cualquier hora y para cualquier visita.': 'Brewed in a pot with panela, any time of day, for any guest.',
    'Ficha de cata': 'Cupping notes',
    'Aroma': 'Aroma',
    'Panela, flores': 'Panela, flowers',
    'Acidez': 'Acidity',
    'Brillante, cítrica': 'Bright, citrus',
    'Cuerpo': 'Body',
    'Sedoso': 'Silky',
    'Final': 'Finish',
    'Chocolate, largo': 'Chocolate, long',
    'Referencial. Cada finca y cada cosecha cuentan algo distinto.': 'For reference. Every farm and every harvest tells something different.',

    // experiencias
    'VI · Experiencias comunitarias': 'VI · Community experiences',
    'Postales': 'Postcards',
    'que se viven': 'you can live',
    'Turismo hecho con y por la comunidad. Lo que pagas se queda en las familias, asociaciones y resguardos que te reciben.':
      'Tourism made with and by the community. What you pay stays with the families, associations and indigenous reserves that host you.',
    'Postal I · Cosecha': 'Postcard I · Harvest',
    'Recolectar con una familia cafetera': 'Pick coffee with a farming family',
    'Recolección con una familia': 'Harvesting with a family',
    'Canasto a la cintura, madrugada y almuerzo en la finca. Aprendes a elegir solo el grano rojo, maduro, como lo hacen desde hace generaciones.':
      'Basket at your waist, an early start and lunch at the farm. You learn to pick only the ripe red cherries, as they have for generations.',
    'Una jornada': 'One day',
    'Con': 'With',
    'Familias productoras': 'Farming families',
    'Temporada': 'Season',
    'Abril — junio · Octubre — diciembre': 'April — June · October — December',
    'Postal II · Taza': 'Postcard II · Cup',
    'Taller de tostión y cata': 'Roasting and cupping workshop',
    'Del grano verde al tueste medio. Sorbes con cuchara como los catadores y descubres por qué el café de estas montañas llega a mesas del mundo entero.':
      'From green bean to medium roast. You slurp from a spoon like professional cuppers and discover why coffee from these mountains reaches tables around the world.',
    'Tres horas': 'Three hours',
    'Asociaciones de productores': 'Grower associations',
    'Todo el año': 'All year',
    'Postal III · Territorio': 'Postcard III · Territory',
    'Tejer y escuchar en Gaitania': 'Weave and listen in Gaitania',
    'Tejido con mujeres Nasa': 'Weaving with Nasa women',
    'Una tarde con tejedoras que explican el significado de cada figura. Visita guiada y acordada con la comunidad, siempre con respeto por sus tiempos.':
      'An afternoon with weavers who explain the meaning of each figure. A guided visit agreed with the community, always respecting their rhythms.',
    'Media jornada': 'Half day',
    'Comunidad Nasa': 'Nasa community',
    'Previa reserva': 'By reservation',
    'Postal IV · Palabra': 'Postcard IV · Stories',
    'Noche de fogón y relatos': 'Fireside night and stories',
    'Cena campesina, música de cuerda y las historias de un territorio que hoy apuesta por la paz y por recibir a quien llega con curiosidad.':
      'A farmhouse dinner, string music and the stories of a land that today bets on peace and on welcoming curious travelers.',
    'Una noche': 'One night',
    'Anfitriones locales': 'Local hosts',
    'Fines de semana': 'Weekends',

    // eventos
    'VII · Eventos': 'VII · Events',
    'Fechas de referencia — confirma cada año con la organización local.': 'Reference dates — confirm each year with local organizers.',
    'Reinado, desfiles, cabalgata y sanjuanero en la plaza principal.': 'Pageant, parades, horseback parade and sanjuanero dancing on the main square.',
    'Entrada': 'Entry',
    'Libre': 'Free',
    'Festival del Café Especial': 'Specialty Coffee Festival',
    'Festival del café': 'Coffee festival',
    'Concurso de taza, feria de productores, tostadores invitados y música en vivo.': 'Cup competition, growers’ fair, guest roasters and live music.',
    'Cabecera municipal': 'Town center',
    'Abr': 'Apr',
    'Temporada de cosecha': 'Harvest season',
    'Las fincas se llenan de recolectores. El mejor momento para vivir el café de cerca.': 'Farms fill with pickers. The best time to experience coffee up close.',
    'Veredas cafeteras': 'Coffee villages',
    'Con reserva': 'With reservation',
    'Dom': 'Sun',
    'Mercado campesino': 'Farmers’ market',
    'Cada domingo bajan de las veredas: frutas, quesillo, panela, café en grano y conversación.': 'Every Sunday farmers come down with fruit, fresh cheese, panela, whole-bean coffee and conversation.',
    'Plaza de mercado': 'Market square',
    'Dic': 'Dec',
    'Novenas y alumbrado': 'Novenas and lights',
    'Navidad en la montaña': 'Christmas in the mountains',
    'Natilla, buñuelos y villancicos con tiple en las noches frías de diciembre.': 'Natilla, buñuelos and carols with tiple on cool December nights.',
    'Barrios y veredas': 'Neighborhoods and villages',

    // mapa
    'VIII · Mapa': 'VIII · Map',
    'Cómo': 'Getting',
    'llegar': 'here',
    'Planadas está en el extremo sur del Tolima, sobre la vertiente oriental de la Cordillera Central, cerca de los límites con Huila y Cauca.':
      'Planadas lies at the southern tip of Tolima, on the eastern slope of the Central Andes, near the borders with Huila and Cauca.',
    'Desde Neiva': 'From Neiva',
    'Desde Ibagué': 'From Ibagué',
    'Desde Bogotá': 'From Bogotá',
    'Tiempos aproximados por carretera. Consulta el estado de las vías antes de viajar.': 'Approximate driving times. Check road conditions before traveling.',
    'Mapa de Planadas, Tolima, Colombia': 'Map of Planadas, Tolima, Colombia',

    // planea tu viaje
    'IX · Planea tu viaje': 'IX · Plan your trip',
    'Todo listo': 'All set',
    'para subir': 'for the climb',
    'El clima de hoy, la mejor época para venir y lo que conviene saber antes de tomar la carretera hacia la montaña.':
      'Today’s weather, the best time to come and what to know before hitting the road to the mountains.',
    'Ahora en Planadas': 'Now in Planadas',
    'Cargando el clima…': 'Loading weather…',
    'Sensación': 'Feels like',
    'Humedad': 'Humidity',
    'Viento': 'Wind',
    'Lluvia hoy': 'Rain today',
    'Pronóstico:': 'Forecast:',
    '· cabecera municipal, ≈1.450 m': '· town center, ≈1,450 m',
    'Cuándo': 'When',
    'venir': 'to come',
    'El año en la montaña tiene dos cosechas y dos temporadas de lluvia. Úsalo como referencia.':
      'The mountain year has two harvests and two rainy seasons. Use it as a guide.',
    'Calendario de temporadas': 'Seasonal calendar',
    'E': 'J',
    'Cosecha de café': 'Coffee harvest',
    'Más lluvias': 'Rainier',
    'Más seco': 'Drier',
    'Nuestro consejo:': 'Our tip:',
    'abril–junio u octubre–diciembre si quieres vivir la cosecha; junio, julio o enero si prefieres caminos más secos.':
      'April–June or October–December to experience the harvest; June, July or January for drier roads.',
    'Por carretera desde Neiva, Ibagué o Chaparral. Hay buses intermunicipales y camperos; consulta horarios en las terminales y el estado de las vías antes de salir.':
      'By road from Neiva, Ibagué or Chaparral. There are intercity buses and jeeps; check schedules at the terminals and road conditions before leaving.',
    'Ver el mapa': 'See the map',
    'Dónde dormir': 'Where to stay',
    'Hoteles alrededor del parque principal, hostales sencillos y fincas cafeteras que reciben huéspedes. Escríbenos y te conectamos con anfitriones locales.':
      'Hotels around the main square, simple hostels and coffee farms that welcome guests. Write to us and we’ll connect you with local hosts.',
    'Pedir recomendaciones': 'Ask for recommendations',
    'Dónde comer': 'Where to eat',
    'Restaurantes de comida casera cerca de la plaza, la plaza de mercado para desayunar y, en las fincas, almuerzo de fogón con lo que da la tierra.':
      'Home-cooking restaurants near the square, the market for breakfast and, on the farms, wood-fire lunches made with what the land gives.',
    'Ver la carta': 'See the menu',
    'Dinero y señal': 'Money and signal',
    'Lleva efectivo: en las veredas casi no se paga con tarjeta. La señal de celular es buena en la cabecera y puede fallar en las zonas altas.':
      'Bring cash: cards are rarely accepted in the rural villages. Cell signal is good in town and can drop in the highlands.',
    'Salud y cuidado': 'Health and safety',
    'Hay servicios de salud en la cabecera municipal. Camina con guía local en rutas largas, hidrátate y usa protector solar: el sol de montaña engaña.':
      'Health services are available in town. Walk long routes with a local guide, stay hydrated and wear sunscreen: the mountain sun is deceptive.',
    'Respeto por el territorio': 'Respect the land',
    'Pide permiso antes de fotografiar a las personas, visita el territorio Nasa solo con acompañamiento de la comunidad y llévate tu basura de regreso.':
      'Ask before photographing people, visit Nasa territory only with the community’s guidance and take your trash back with you.',
    'Tu': 'Your',
    'maleta': 'packing list',
    'Marca lo que ya empacaste. La lista se guarda en este navegador.': 'Tick what you’ve packed. The list is saved in this browser.',
    '¡Listo para subir!': 'Ready for the climb!',
    'Chaqueta ligera para las noches': 'Light jacket for the evenings',
    'Impermeable o paraguas': 'Raincoat or umbrella',
    'Zapatos o botas para caminar': 'Walking shoes or boots',
    'Protector solar y gorra': 'Sunscreen and a cap',
    'Repelente de insectos': 'Insect repellent',
    'Efectivo en billetes pequeños': 'Cash in small bills',
    'Documento de identidad': 'ID or passport',
    'Botella de agua reutilizable': 'Reusable water bottle',
    'Batería externa para el celular': 'Power bank for your phone',
    'Ganas de probar café recién tostado': 'An appetite for freshly roasted coffee',

    // contacto
    'X · Contacto': 'X · Contact',
    'Ven a': 'Come to',
    'Correo': 'Email',
    'Oficina': 'Office',
    'Parque principal · Planadas, Tolima': 'Main square · Planadas, Tolima',
    'Querida montaña:': 'Dear mountain,',
    'Me llamo': 'My name is',
    'y me pueden escribir a': 'and you can write to me at',
    'Quisiera visitarles en': 'I would like to visit in',
    'con': 'with',
    'personas, y me gustaría vivir:': 'people, and I would love to experience:',
    'tu nombre': 'your name',
    'tu correo': 'your email',
    'mes o fecha': 'month or date',
    'Algo más que quieras contarnos…': 'Anything else you’d like to tell us…',
    'Ruta cafetera': 'Coffee route',
    'Cata de café': 'Coffee cupping',
    'Cultura Nasa': 'Nasa culture',
    'Cocina de fogón': 'Wood-fire cooking',
    'Enviar carta': 'Send letter',
    'Carta recibida.': 'Letter received.',
    'Te responderemos pronto desde la montaña.': 'We’ll write back soon from the mountains.',

    // footer
    'Un viaje al sur del Tolima,': 'A journey to southern Tolima,',
    'donde la montaña se sirve en taza.': 'where the mountain is served in a cup.',
    'Planear mi visita': 'Plan my visit',
    'Experiencias': 'Experiences',
    'Para el viajero': 'For travelers',
    'Dónde queda Planadas': 'Where Planadas is',
    'Película del territorio': 'Film of the region',
    'Temporadas de cosecha': 'Harvest seasons',
    'Turismo comunitario': 'Community tourism',
    'Créditos de fotografía, sonido y mapas': 'Photo, sound and map credits',
    'Fotografías y grabaciones de': 'Photos and recordings from',
    ', usadas según sus licencias libres. Algunas imágenes son ilustrativas de Colombia y no fueron tomadas en Planadas.':
      ', used under their free licenses. Some images illustrate Colombia in general and were not taken in Planadas.',
    'Fotografía': 'Photography',
    'Sonido': 'Sound',
    'Viento, fogón y cuerdas del índice': 'Wind, fire and menu strings',
    'sintetizados en el navegador.': 'synthesized in the browser.',
    'Mapas': 'Maps',
    'Globo satelital': 'Satellite globe',
    'Fronteras': 'Borders',
    'Natural Earth vía world-atlas ·': 'Natural Earth via world-atlas ·',
    'Mapa interactivo': 'Interactive map',
    'Película': 'Film',
    'Hecho con café de origen': 'Made with origin coffee',
    'Volver a la cima ↑': 'Back to the top ↑',
    'Cambiar idioma / Change language': 'Change language / Cambiar idioma',

    // números
    '1.400': '1,400', '2.200': '2,200',
    '1.450 — 1.900 m': '1,450 — 1,900 m', '1.600 — 2.200 m': '1,600 — 2,200 m',
    '1.200 — 1.700 m': '1,200 — 1,700 m', '1.500 — 2.000 m': '1,500 — 2,000 m'
  };

  const ATTRS = ['placeholder', 'aria-label', 'data-label', 'data-cursor', 'title', 'alt', 'data-open', 'data-close', 'data-section'];
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const textOrig = new Map();   // nodo de texto -> texto original en español
  const attrOrig = new WeakMap(); // elemento -> { atributo: original }
  const listeners = [];
  let lang = 'es';
  let metaDesc = null, titleEs = null;

  function translateText(node, to, from) {
    let rec = textOrig.get(node);
    if (!rec) { rec = { orig: node.nodeValue, last: node.nodeValue }; textOrig.set(node, rec); }
    // si el JavaScript cambió el texto estando en español, ese es el nuevo original
    else if (node.nodeValue !== rec.last && from === 'es') rec.orig = node.nodeValue;
    let v = rec.orig;
    if (to === 'en') {
      const m = rec.orig.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const en = EN[norm(m[2])];
      if (en != null) v = m[1] + en + m[3];
    }
    if (node.nodeValue !== v) node.nodeValue = v;
    rec.last = v;
  }

  function applyDom(to, from) {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        const p = n.parentElement;
        if (!p || p.closest('script,style,svg,[translate="no"],.char-wrap')) return NodeFilter.FILTER_REJECT;
        return norm(n.nodeValue) || textOrig.has(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    let n;
    while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach((node) => translateText(node, to, from));

    const sel = ATTRS.map((a) => '[' + a + ']').join(',');
    document.querySelectorAll(sel).forEach((el) => {
      let o = attrOrig.get(el);
      if (!o) { o = {}; attrOrig.set(el, o); }
      ATTRS.forEach((a) => {
        if (!el.hasAttribute(a)) return;
        if (!(a in o)) o[a] = el.getAttribute(a);
        const v = to === 'es' ? o[a] : (EN[norm(o[a])] != null ? EN[norm(o[a])] : o[a]);
        if (el.getAttribute(a) !== v) el.setAttribute(a, v);
      });
    });

    if (titleEs == null) titleEs = document.title;
    document.title = to === 'es' ? titleEs : (EN[norm(titleEs)] || titleEs);
    metaDesc = metaDesc || document.querySelector('meta[name="description"]');
    if (metaDesc) {
      if (!metaDesc.dataset.es) metaDesc.dataset.es = metaDesc.content;
      metaDesc.content = to === 'es' ? metaDesc.dataset.es : (EN[norm(metaDesc.dataset.es)] || metaDesc.dataset.es);
    }
    document.documentElement.lang = to;
  }

  function detect() {
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q === 'es' || q === 'en') return q;
      const saved = localStorage.getItem('planadas-lang');
      if (saved === 'es' || saved === 'en') return saved;
    } catch (e) { /* sin almacenamiento */ }
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'es';
    return /^es\b/i.test(nav) ? 'es' : 'en';
  }

  const api = {
    get lang() { return lang; },
    t(key) { return (STR[lang] && STR[lang][key]) || STR.es[key] || key; },
    set(to) {
      if (to !== 'es' && to !== 'en') return;
      const from = lang;
      lang = to;
      applyDom(to, from);
      try { localStorage.setItem('planadas-lang', to); } catch (e) { /* sin almacenamiento */ }
      listeners.forEach((fn) => { try { fn(to); } catch (e) { console.error(e); } });
    },
    onChange(fn) { listeners.push(fn); }
  };

  // idioma inicial (antes de que arranquen las animaciones)
  lang = detect();
  if (lang !== 'es') applyDom(lang, 'es');
  else document.documentElement.lang = 'es';
  return api;
})();
