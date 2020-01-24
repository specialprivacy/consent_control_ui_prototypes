// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAFFtXdEtsQfEzsm_61pJ2h7di7j7Tgpv8',
    authDomain: 'cr-wizard-en.firebaseapp.com',
    databaseURL: 'https://cr-wizard-en.firebaseio.com',
    projectId: 'cr-wizard-en',
    storageBucket: 'cr-wizard-en.appspot.com',
    messagingSenderId: '109582264238'
  }
};
