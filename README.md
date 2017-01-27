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
![alt text](https://raw.githubusercontent.com/martinsebastien/RIA2/master/assets/images/firebase.PNG "Screen depuis le jeu")

Les identifiants avec des chiffres et des lettres sont des identifiants générés automatiquement par firebase.

Dans mon projet, vous retrouverez (par exemple dans battle.js) plusieurs utilisation de firebase.

```js
this.battle_ref = bdd.database().ref().child("battles").child(extra_parameters.battle_id);
```

Cette ligne, par exemple, se connecte à ma base de donnée, dit qu'elle aimerait effectuer des requête dessus (database -> il est possible également de stocker des données ou de faire de l'authentification) puis récupère l'enfant "battles" et la bataille correspondant à mon argument extra_parameters.battle_id. Cette ligne est donc une référence vers cette entrée dans la base de donnée. L'intégralité de mes requêtes au sein de battle.js se feront à partir de celle-là.

```js
// Ecoute la bdd pour savoir si un utilisateur c'est déconnecté
this.battle_ref.on("value", this.disconnect.bind(this));
// Execute une fois la fonction "create_units_queue"
this.battle_ref.once("value", this.create_units_queue.bind(this));
// Lorsque un utilisateur se déconnecte, on supprime l'instance de la bataille
this.battle_ref.onDisconnect().remove();
```
 Dans les lignes ci-dessus, je créé un écouteurs firebase (.on("value",....)) qui executera la fonction en second paramètre à chaque fois qu'il y aura un changement de valeur. Cet écouteur ce prolonge jusqu'au enfant, c'est pourquoi dans la fonction disconnect je véréfie la valeur retournée (de changement de valeur) afin de savoir si il s'agit d'une déconnexion ou d'une action banale d'une partie. En effet, avec la 3ème ligne ci-dessus, je dis à firebase que lorsqu'un utilisateur se déconnecte de supprimer l'instance battle dans laquelle il était. La conséquence sera un changement de valeur (suppression de l'entrée) qui sera écouté par le premier et retournera la valeur "null" à la fonction disconnect (le seul cas où la valeur retournée peut être null). C'est ainsi que j'ai géré ces possibles erreurs et permit à mon système de faire en sorte que lorsqu'un utilisateur est déconnecté, l'utilisateur encore en partie et redirigé vers la page d'acceuil avec une notification : Vous avez gagné, votre adversaire a été déconnecté.

 ```js
  disconnect(snapshot) {
    if (!snapshot.val()) {
      this.game.state.start("Boot", true, false, "assets/levels/title_screen.json", "Title");
      popupDisconnect();
    }
  }
  ```

  Dans le script Preparation.js, il est possible de voir comment effectuer des insertions dans une bdd firebase.

```js
this.battle_ref.child(this.local_player).child("units").push(this.current_unit_to_place);
```
Il suffit de se placer au niveau où l'on veut faire l'insertion (ici dans units) et de ```push``` notre élément qui peut être représenté sous forme de json afin de remplir automatiquement toutes ces propriétés.

Enfin, pour changer l'etat d'une entrée (la mettre à jours), il faut procéder de la façon suivante : 

```js
this.battle_ref.child(this.local_player).child("prepared").set(true, this.wait_for_enemy.bind(this));
```
On sélectionne la propriété a modifié (ici ```prepared```) et on la set à true. Il est possible de joindre à l'action (comme à toutes les actions avec firebase) une fonction de callback. Ici, ma fonction s'appelle wait_for_enemy et s'occupera d'attendre que l'ennemi ait également fini de positionner ces troupes (avec un .on('value') de firebase).

## Gameplay

Les règles du jeu sont les suivantes:

- Commencer par vous connectez avec votre compte Google. Vous serez automatiquement amené au "lobby" (recherche d'adversaire).
- Une fois un adversaire trouvé (ou vous même si vous avez ouvert un deuxième onglet), vous devrez positionner 4 unités sur des cellules de couleur. Votre camp peut être le rouge ou le bleu, tout dépend de si vous avez rejoint une bataille en attente d'un adversaire ou pas.
- Une fois la phase de placement terminé, la bataille commence ! Les unités ennemies s'affiche et le personnage dont le tour est en cours a une teinte bleu ou rouge selon le côté de la carte où il a commencé.
- Une fenêtre d'action s'affiche en haut à gauche de l'écran. Vous avez la possibilité de bouger, attaquer ou passer votre tour. Vous ne pouvez effectuer que une action par tour. Ainsi, lorsque vous vous serez déplacé ou que vous aurez attaqué votre tour sera automatiquement passé.

Le vainqueur est celui qui aura éliminé toutes les troupes adverses.

Vous trouverez le jeu en ligne sur un serveur de production à l'adresse suivante : 

# http://game.dowa-app.com

# AWA Documentation

## Fichiers important à regarder

- Unit.js : Qui créé les sprites et les anime (initialise et start les tweens)
- Pathinding.js : Calcule la trajectoire à suivre
- Tiled.js : Qui créé la carte
- Battle.js : Qui ordonne les actions
- Prefab.js : Fichier qui créé les animations
- Title.js : Ecran titre, affichage de l'image de fond et de traitement de texte

## Explications

J'ai créé la carte à l'aide du logiciel Tiled, qui me permet de générer un fichier JSON comprenant toutes les informations qui me seront utile. Comme les cellules impraticables, quelle image utilisé sur quelle cellule, etc..

Pour créer les animations des sprites, j'ai utilisé texture packer afin d'assembler les images en une (spritesheet) et me générer un fichier JSON qui indique quelle suite d'image utilisé pour telle animation.
On peut retrouver tout les sprites générés et la structure de fichier pour les générer dans le dossier asstes/images.

Le pathfinding est une sommité de complexité en terme d'animation. J'utilise la librairie EasyStar.js mais ceci ne suffit pas et pour l'intégrer au jeu avec les animations j'ai du créer plusieurs objet (un objet pathfinding et un objet unit). 
J'ai commenté le code le chaque fichier pour vous aider à vous repérer et comprendre le code qui n'est pas du tout évident de premier abord.

Dans ce projet j'ai également appris l'affichage d'image dans un canvas, les animations (tweens), l'affichage de texte et le traitement de texte (effet d'ombrage). En effet, la page d'accueil, hormis le bouton de connexion Google, est entièrement rendu dans un canvas et créé avec les outils que Phaser met à disposition. J'ai aussi passé beaucoup de temps à créer un jeu "responsive". En effet, il y a plusieurs manière possible de rendre un canvas en terme de résolution et d'échelle. J'ai effectué beaucoup de recherche à ce sujet afin de proposer un envirronement de jeux confortable et flexible (jouable également sur smartphone).

La transition entre les différents états du jeu était également un point bien spécifique au canvas et très différent que pourrait l'être un affichage HTML qui dans lequel on ne peut pas supprimer les éléments mais seulement au mieux les cacher (display: none).

Vous trouverez dans la liste de fichier ci-dessus davantage d'explication sur leur fonctionnement sous forme de commentaire dans le code.

J'ai également réalisé plusieurs pop-up html pour soit résumer l'état du jeu (victoire ou défaite) soit indiquer au joueur qu'il a débloquer des succès. Ces pop-up sont animées avec animate.css et ont un timer qui les fait disparaitre après 4.5 secondes. 