import { db } from './index';
import { parkings, users } from './schema';

async function seed() {
  console.log('Seeding parkings...');
  const parkingData = [
    { name: 'A1 - Parking Nadarzyn', highway: 'A1', country: 'Poland', latitude: 52.09, longitude: 20.81 },
    { name: 'A2 - Autohof Uhrsleben', highway: 'A2', country: 'Germany', latitude: 52.20, longitude: 11.26 },
    { name: 'M1 - Leicester Forest East', highway: 'M1', country: 'UK', latitude: 52.62, longitude: -1.20 },
    { name: 'A7 - Aire de Montélimar', highway: 'A7', country: 'France', latitude: 44.56, longitude: 4.75 },
    { name: 'A1 - Nadlac II', highway: 'A1', country: 'Romania', latitude: 46.16, longitude: 20.72 },
    { name: 'A3 - Bors I', highway: 'A3', country: 'Romania', latitude: 47.12, longitude: 21.80 },
    { name: 'A4 - Autogrill Somaglia', highway: 'A1', country: 'Italy', latitude: 45.14, longitude: 9.63 },
    { name: 'AP-7 - La Jonquera', highway: 'AP-7', country: 'Spain', latitude: 42.41, longitude: 2.87 },
    { name: 'A1 - Aire de Ressons-sur-Matz', highway: 'A1', country: 'France', latitude: 49.49, longitude: 2.76 },
    { name: 'A1 - Autogrill Secchia Ovest', highway: 'A1', country: 'Italy', latitude: 44.69, longitude: 10.87 },
    { name: 'A2 - Autohof Gütersloh', highway: 'A2', country: 'Germany', latitude: 51.91, longitude: 8.42 },
    { name: 'A4 - Rest area Zgorzelec', highway: 'A4', country: 'Poland', latitude: 51.15, longitude: 15.02 },
    { name: 'A12 - Autohof Inntal', highway: 'A12', country: 'Austria', latitude: 47.23, longitude: 11.45 },
    { name: 'M0 - Annahegyi pihenőhely', highway: 'M0', country: 'Hungary', latitude: 47.39, longitude: 19.01 },
    { name: 'A1 - Parking De Heuvel', highway: 'A1', country: 'Netherlands', latitude: 52.23, longitude: 5.48 },
    { name: 'E4 - Truckstop Nyköping', highway: 'E4', country: 'Sweden', latitude: 58.75, longitude: 17.01 },
    { name: 'A1 - Arad South', highway: 'A1', country: 'Romania', latitude: 46.13, longitude: 21.32 },
    { name: 'A2 - Constanta Port', highway: 'A2', country: 'Romania', latitude: 44.13, longitude: 28.60 },
    { name: 'A6 - Aire de Jugy', highway: 'A6', country: 'France', latitude: 46.61, longitude: 4.86 },
    { name: 'A9 - Autohof Münchberg', highway: 'A9', country: 'Germany', latitude: 50.18, longitude: 11.78 },
    { name: 'A10 - Aire de Poitiers-Chincé', highway: 'A10', country: 'France', latitude: 46.64, longitude: 0.38 },
    { name: 'M6 - Corley Services', highway: 'M6', country: 'UK', latitude: 52.47, longitude: -1.51 },
    { name: 'A22 - Brennero Truck Park', highway: 'A22', country: 'Italy', latitude: 47.01, longitude: 11.51 },
    { name: 'AP-7 - Porta Barcelona', highway: 'AP-7', country: 'Spain', latitude: 41.45, longitude: 2.01 },
    { name: 'A1 - Sibiu West', highway: 'A1', country: 'Romania', latitude: 45.79, longitude: 24.11 },
    { name: 'A3 - Gilau Parking', highway: 'A3', country: 'Romania', latitude: 46.75, longitude: 23.38 },
    { name: 'A1 - Aire de Wancourt Ovest', highway: 'A1', country: 'France', latitude: 50.24, longitude: 2.86 },
    { name: 'A2 - Autohof Magdeburg', highway: 'A2', country: 'Germany', latitude: 52.17, longitude: 11.52 },
    { name: 'A4 - Autohof Dresden', highway: 'A4', country: 'Germany', latitude: 51.08, longitude: 13.68 },
    { name: 'A7 - Autohof Kassel', highway: 'A7', country: 'Germany', latitude: 51.27, longitude: 9.53 },
    { name: 'A8 - Aire de l\'Estérel', highway: 'A8', country: 'France', latitude: 43.51, longitude: 6.82 },
    { name: 'A9 - Aire du Village Catalan', highway: 'A9', country: 'France', latitude: 42.59, longitude: 2.85 },
    { name: 'A10 - Aire de Bordeaux-Cestas', highway: 'A10', country: 'France', latitude: 44.73, longitude: -0.70 },
    { name: 'A14 - Autogrill Rubicone', highway: 'A14', country: 'Italy', latitude: 44.15, longitude: 12.44 },
    { name: 'A22 - Autoproduzione Vipiteno', highway: 'A22', country: 'Italy', latitude: 46.88, longitude: 11.44 },
    { name: 'AP-7 - Area del Baix Ebre', highway: 'AP-7', country: 'Spain', latitude: 40.85, longitude: 0.61 },
    { name: 'A1 - Deva East', highway: 'A1', country: 'Romania', latitude: 45.91, longitude: 22.95 },
    { name: 'A1 - Pitesti South', highway: 'A1', country: 'Romania', latitude: 44.82, longitude: 24.91 },
    { name: 'A1 - Bucharest Entrance', highway: 'A1', country: 'Romania', latitude: 44.44, longitude: 25.92 },
  ];

  for (const p of parkingData) {
    await db.insert(parkings).values(p).onConflictDoNothing();
  }

  console.log('Seeding demo users...');
  const demoUsers = [
    { name: 'Marcel Tiristul', email: 'marcel@example.com', role: 'driver', gender: 'male', lookingFor: 'female', bio: 'Pe drumuri de 20 de ani. Caut companie placuta.' },
    { name: 'Elena RoadQueen', email: 'elena@example.com', role: 'driver', gender: 'female', lookingFor: 'male', bio: 'Fata la volan, inima pe sosea.' },
    { name: 'Andrei V8', email: 'andrei@example.com', role: 'driver', gender: 'male', lookingFor: 'female', bio: 'Scania e viata mea.' },
    { name: 'Maria Admiratoare', email: 'maria@example.com', role: 'admirer', gender: 'female', lookingFor: 'male', bio: 'Imi plac barbatii puternici cu camioane mari.' },
  ];

  for (const u of demoUsers) {
    await db.insert(users).values(u).onConflictDoNothing();
  }

  console.log('Seed complete!');
}

seed().catch(console.error);
