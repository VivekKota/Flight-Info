export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDmXng3LRPo9bmT_N1ITGewjYv0oRImn1k',
    authDomain: 'flight-info-e062f.firebaseapp.com',
    projectId: 'flight-info-e062f',
    storageBucket: 'flight-info-e062f.appspot.com',
    messagingSenderId: '1076079698767',
    appId: '1:1076079698767:web:68734e5bc67358b3769b3a',
  },
  api: {
    url: 'https://us-central1-crm-sdk.cloudfunctions.net/flightInfoChallenge',
    headers: {
      'Content-Type': 'application/json',
      token:
        'WW91IG11c3QgYmUgdGhlIGN1cmlvdXMgdHlwZS4gIEJyaW5nIHRoaXMgdXAgYXQgdGhlIGludGVydmlldyBmb3IgYm9udXMgcG9pbnRzICEh',
      candidate: 'VivekanadaReddyKota',
    },
  },
};
