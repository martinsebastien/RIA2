# Phaser + ES6 + Webpack.
#### Un projet créé avec Phaser + ES6 + Webpack.

![Phaser+ES6+Webpack](https://raw.githubusercontent.com/lean/phaser-es6-webpack/master/assets/images/phaser-es6-webpack.jpg)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


## Features
- JavaScript Standard Style
- Javascript dernière génération
- Webpack
- Testé sous plusieurs browser
- Phaser API
- Google games API
- Firebase API
- Pathfinding
- Priority queue and FIFO
- Responsive


# Installation
Pour utiliser ce repo, vous avez besoin d'installer quelques programmes avant d'avoir une version locale fonctionnelle.

## 1. Cloner le repo

Naviguer dans le dossier de destination et tapper la commande suivante :

```git clone https://github.com/martinsebastien/RIA2.git```

## 2. Installer node.js and npm:

https://nodejs.org/en/


## 3. Installer les dépendences:

Naviguer dans le répertoire cloné et executer la commande suivante :

```npm install```

## 4. Faire tourner le serveur de développement

Executer la commande suivante :

```npm run dev```

Ceci va faire tourner le jeu sur un serveur local dans n'importe quel browser.

Ouvrez votre browser préféré et tapper : ```localhost:3000``` dans la barre d'adresse 

Cette dernière commande (npm run dev) va également lancé un système de "watch" du code. C'est à dire que l'on peut modifié les sources du projet et elles seront automatiquement recompilée et mises à jour dansle browser.


## Build pour le déploiement:

Executer la commande suivante:

```npm run deploy```

 Cette commande va optimisé et minifier le bundle compilé.

 # Documentation technique

 ![alt text](https://raw.githubusercontent.com/martinsebastien/RIA2/master/assets/images/screen1.png "Screen depuis Google Play")
 ![alt text](https://raw.githubusercontent.com/martinsebastien/RIA2/master/assets/images/screen2.png "Screen depuis Google Play")

 ## Google Play games API

 Utiliser l'API Google Play games fut plutôt laborieuse. En effet, j'ai dû créer un compte Google Play developer (qui coûte CHF 25.-), créé une application et finalement un service Google Play games lié à une application web (game.dowa-app.com). Il est nécessaire de remplir plusieurs questionnaires ainsi que de créer au moins 5 succès afin de publier une application. 
 
 Chaque succès doit obligatoirement avoir une image (de 512x512px), un nombre de points (entre 5 et 200), un nom et une description. Chaque succès a un identifiant unique (code de référence) que l'on utilisera dans l'application pour identifier quel succès débloquer.

Techniquement parlant, si l'on veut pouvoir déverrouiller des succès Google Play games dans son jeu, il est nécessaire d'utiliser une authentification Oauth2. Il est vivement conseiller d'utiliser le bouton Sign In de google afin d'identifier les utilisateurs. Ensuite, placer le code suivant à l'endroit désiré pour effectuer un appel sur l'API Google Play games et ainsi déverrouiller un succès:

```js
      // Charge les librairies authentification et signin
      gapi.load('auth2,signin2', function () {
        // Initialise l'authentification
        let auth2 = gapi.auth2.init();
        auth2.then(function () {
          // Valeur courante d'authentification
          let isSignedIn = auth2.isSignedIn.get();
          let currentUser = auth2.currentUser.get();

          if (!isSignedIn) {
            console.log('Player is not sign in');
          } else {
            // Si l'utilisateur est identifié, on charge la librairie games
            gapi.client.load('games', 'v1', function () {
            });

            // On effectue une requête avec l'objet gapi
            gapi.client.request({
              // Insérer l'identifiant du succès à débloquer
              path: '/games/v1/achievements/IDENTITFIANT_DU_SUCCES/unlock',
              // La requête doit être passée en POST
              method: 'post',       
              // Fonction de callback avec la réponse de la requête
              callback: function (response) {
              // Si le succès vient d'être déverrouillé :
                if (response.newlyUnlocked) {
              // Affiche une popup (code personnel)
                  popupSuccess();
                }
              }
            });
          }
        });
      });
      // End achievement
```

Pour pouvoir utiliser l'identification Google afin de pouvoir exécuter le code ci-dessus, il est nécessaire d'introduire les meta tags suivant dans le header du fichier HTML :

```HTML
<meta name="google-signin-client_id" content="ID_CLIENT.apps.googleusercontent.com" />
<meta name="google-signin-cookiepolicy" content="single_host_origin" />
<meta name="google-signin-callback" content="signinCallback" />
<meta name="google-signin-scope" content="https://www.googleapis.com/auth/games  https://www.googleapis.com/auth/plus.login"/>
```
Il faut référencé son ID_CLIENT, définir la politique de cookie, définir la fonction de callback qui sera appelé lors de l'identification (peut être overridée par le bouton SignIn) et définir le scope d'application de l'identification (dans notre cas le service games et l'authentification google+).

Enfin le code du bouton signIn de Google :

```HTML
<div class="g-signin2" data-onsuccess="onSignIn"></div>
```

Il est évidemment nécessaire de faire appel à quelques script (CDN) pour que la magie opère :

```HTML
<script src="https://apis.google.com/js/client.js"></script>
<script src="https://apis.google.com/js/platform.js" async defer></script>
```

Une fois que vous vous êtes identifié au jeu, vous pouvez le retrouver dans vos applications Google Play games (comme le montre les screens plus haut). Vous pouvez donc retracer les succès débloquer, ceux qui vous reste à débloquer et le nombre de points qu'ils vous ont fait gagné.

Dans mon projet, je récupère également les informations basiques de l'utilisateur (comme son nom, son avatar etc...) et j'affiche l'avatar de l'utilisateur authentifier en haut à droite de la page.

![alt text](https://raw.githubusercontent.com/martinsebastien/RIA2/master/assets/images/profilpic.PNG "Screen depuis le jeu")

## Firebase API

Firebase est un backend as a service. C'est à dire une base de donnée dynamique créée chez Google. Elle permet d'accéder à des statistique d'utilisation sur la console de firebase et et notifié via des écouteurs tous les changements en temps réel aux autres utilisateurs connecté à la base. C'est grâce à ce système ultra puissant que j'ai développé le côté multijoueur de mon jeu.

Afin d'utiliser l'API firebase, il vous faut vous connecter avec votre compte Google et créer un nouveau projet. A partir de là, ajouter le code suivant à votre projet :
```HTML
<script src="https://www.gstatic.com/firebasejs/3.6.7/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "API_KEY",
    authDomain: "magic-legions.firebaseapp.com",
    databaseURL: "https://magic-legions.firebaseio.com",
    storageBucket: "magic-legions.appspot.com",
    messagingSenderId: "43320763068"
  };
  firebase.initializeApp(config);
</script>
```
Dans mon cas, je n'ai pas utilisé le CDN firebase mais le module NPM de firebase afin de pouvoir le compilé dans mon fichier bundle grâce à webpack et ainsi gagné en vitesse et en requête HTTP pour charger mon application.

J'ai initialisé la config et l'initialisation de mon API firebase grâce à une classe ES6 afin de l'utiliser comme un objet (que j'ai nommé BDD).

Après la création d'une partie et le placement des joueurs, voici à quoi ressemble la structure de ma base de donnée firebase : 
![alt text](https://raw.githubusercontent.com/martinsebastien/RIA2/master/assets/images/profilpic.PNG "Screen depuis le jeu")

