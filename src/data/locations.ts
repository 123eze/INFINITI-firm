import { CountryLocation } from '../types';

export const MEETUP_LOCATIONS_DATA: CountryLocation[] = [
  {
    country: 'United States',
    code: 'US',
    states: [
      {
        name: 'California',
        cities: [
          {
            name: 'Los Angeles',
            spots: [
              {
                id: 'spot_la_01',
                name: 'Sunset Sound Studios (Studio 2)',
                type: 'Acoustic Studio',
                addressSnippet: '6650 Sunset Blvd, Hollywood, CA',
              },
              {
                id: 'spot_la_02',
                name: 'Chateau Marmont Private Penthouse Salon',
                type: 'Dining Salon',
                addressSnippet: '8221 Sunset Blvd, West Hollywood, CA',
              },
              {
                id: 'spot_la_03',
                name: 'The Greek Theatre Greenroom Suite',
                type: 'Backstage Greenroom',
                addressSnippet: '2700 N Vermont Ave, Los Angeles, CA',
              },
            ],
          },
          {
            name: 'San Francisco',
            spots: [
              {
                id: 'spot_sf_01',
                name: 'The Battery Penthouse Salon',
                type: 'Dining Salon',
                addressSnippet: '717 Battery St, San Francisco, CA',
              },
              {
                id: 'spot_sf_02',
                name: 'Davies Symphony Hall VIP Tier Lounge',
                type: 'Landmark',
                addressSnippet: '201 Van Ness Ave, San Francisco, CA',
              },
            ],
          },
        ],
      },
      {
        name: 'New York',
        cities: [
          {
            name: 'New York City',
            spots: [
              {
                id: 'spot_nyc_01',
                name: 'Electric Lady Studios (Live Room A)',
                type: 'Acoustic Studio',
                addressSnippet: '52 W 8th St, Greenwich Village, NY',
              },
              {
                id: 'spot_nyc_02',
                name: 'The Bowery Hotel Private Atelier Terrace',
                type: 'Atelier',
                addressSnippet: '335 Bowery, New York, NY',
              },
              {
                id: 'spot_nyc_03',
                name: 'Lincoln Center David Geffen Hall VIP Box',
                type: 'Landmark',
                addressSnippet: '10 Lincoln Center Plaza, New York, NY',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    country: 'Japan',
    code: 'JP',
    states: [
      {
        name: 'Tokyo Prefecture',
        cities: [
          {
            name: 'Tokyo (Shibuya / Shinjuku)',
            spots: [
              {
                id: 'spot_tokyo_01',
                name: 'Tokyo Sphere 360 Spatial Rehearsal Arena',
                type: 'Acoustic Studio',
                addressSnippet: 'Shinjuku Center Building B2, Tokyo',
              },
              {
                id: 'spot_tokyo_02',
                name: 'Park Hyatt Private Grill & Bar Salon',
                type: 'Dining Salon',
                addressSnippet: '3-7-1-2 Nishi-Shinjuku, Tokyo',
              },
              {
                id: 'spot_tokyo_03',
                name: 'Aoyama Sound Design Atelier',
                type: 'Atelier',
                addressSnippet: 'Minami-Aoyama 5-Chome, Minato City, Tokyo',
              },
            ],
          },
        ],
      },
      {
        name: 'Kyoto Prefecture',
        cities: [
          {
            name: 'Kyoto',
            spots: [
              {
                id: 'spot_kyoto_01',
                name: 'Roku Kyoto Private Tea Pavilion',
                type: 'Dining Salon',
                addressSnippet: '44-1 Shozan Resort, Kita Ward, Kyoto',
              },
              {
                id: 'spot_kyoto_02',
                name: 'Gion Acoustic Sanctuary & Garden',
                type: 'Landmark',
                addressSnippet: 'Higashiyama Ward, Kyoto',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    country: 'France',
    code: 'FR',
    states: [
      {
        name: 'Île-de-France',
        cities: [
          {
            name: 'Paris',
            spots: [
              {
                id: 'spot_paris_01',
                name: 'Palais de Tokyo Haute Atelier',
                type: 'Atelier',
                addressSnippet: '13 Avenue du Président Wilson, 75116 Paris',
              },
              {
                id: 'spot_paris_02',
                name: 'Hôtel de Crillon Salon Marie-Antoinette',
                type: 'Dining Salon',
                addressSnippet: '10 Place de la Concorde, 75008 Paris',
              },
              {
                id: 'spot_paris_03',
                name: 'IRCAM Spatial Acoustic Laboratory',
                type: 'Acoustic Studio',
                addressSnippet: '1 Place Igor Stravinsky, 75004 Paris',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    country: 'Italy',
    code: 'IT',
    states: [
      {
        name: 'Lombardy',
        cities: [
          {
            name: 'Milan',
            spots: [
              {
                id: 'spot_milan_01',
                name: 'Teatro alla Scala Royal Box Foyer',
                type: 'Landmark',
                addressSnippet: 'Via Filodrammatici 2, 20121 Milano',
              },
              {
                id: 'spot_milan_02',
                name: 'Armani Privé VIP Dining Salon',
                type: 'Dining Salon',
                addressSnippet: 'Via Manzoni 31, 20121 Milano',
              },
              {
                id: 'spot_milan_03',
                name: 'Fondazione Prada Sound Atelier',
                type: 'Atelier',
                addressSnippet: 'Largo Isarco 2, 20139 Milano',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    country: 'United Kingdom',
    code: 'GB',
    states: [
      {
        name: 'Greater London',
        cities: [
          {
            name: 'London',
            spots: [
              {
                id: 'spot_london_01',
                name: 'Abbey Road Studio 2 Sound Chamber',
                type: 'Acoustic Studio',
                addressSnippet: '3 Abbey Rd, St John’s Wood, London NW8 9AY',
              },
              {
                id: 'spot_london_02',
                name: 'Chiltern Firehouse Private Dining Salon',
                type: 'Dining Salon',
                addressSnippet: '1 Chiltern St, Marylebone, London W1U 7PA',
              },
              {
                id: 'spot_london_03',
                name: 'Royal Albert Hall Elgar Room VIP Bar',
                type: 'Backstage Greenroom',
                addressSnippet: 'Kensington Gore, South Kensington, London SW7 2AP',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    country: 'Germany',
    code: 'DE',
    states: [
      {
        name: 'Berlin',
        cities: [
          {
            name: 'Berlin',
            spots: [
              {
                id: 'spot_berlin_01',
                name: 'Funkhaus Nalepastrasse (Recording Hall 1)',
                type: 'Acoustic Studio',
                addressSnippet: 'Nalepastraße 18, 12459 Berlin',
              },
              {
                id: 'spot_berlin_02',
                name: 'Aether Sound Guild Kreuzberg Atelier',
                type: 'Atelier',
                addressSnippet: 'Oranienstraße 140, 10969 Berlin',
              },
            ],
          },
        ],
      },
    ],
  },
];
