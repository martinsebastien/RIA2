import Phaser from 'phaser'
import JSONLevelState from './JSONLevelState'
import TextPrefab from '../prefabs/TextPrefab'
import Bdd from '../prefabs/Bdd'
import * as firebase from 'firebase'

export default class extends JSONLevelState {

    constructor() {
        super();

        this.prefab_classes = {
            "text": TextPrefab
        };

        this.INITIAL_PLAYER_DATA = { prepared: false, units: {} };
    }

    create() {
        super.create();
        bdd.database().ref().child("battles").once("value", this.find_battle.bind(this));
        document.getElementById("container-google-button").style.display = "none";
    }

    find_battle(snapshot) {
        let battles, battle, chosen_battle, new_battle;
        battles = snapshot.val();
        for (battle in battles) {
            if (battles.hasOwnProperty(battle) && !battles[battle].full) {
                chosen_battle = battle;
                // On trouve une battle avec de la place dans firebase, place le joueur et initialise l'etat FULL de la battle
                bdd.database().ref().child("battles").child(chosen_battle).child("full").set(true, this.join_battle.bind(this, chosen_battle));
                break;
            }
        }
        if (!chosen_battle) {
            // On met les joueurs dans une battle dans firebase
            this.new_battle = bdd.database().ref().child("battles").push({ player1: this.INITIAL_PLAYER_DATA, player2: this.INITIAL_PLAYER_DATA, full: false });
            this.new_battle.on("value", this.host_battle.bind(this));
        }
    }

    host_battle(snapshot) {
        let battle_data;
        battle_data = snapshot.val();
        console.log(battle_data.full);
        if (battle_data.full) {
            //Si la game est pleine, on ferme la battle
            this.new_battle.off();
            this.game.state.start("Boot", true, false, "assets/levels/preparation_level.json", "Preparation", { battle_id: snapshot.key, local_player: "player1", remote_player: "player2" });
        }
    }

    join_battle(battle_id) {
        console.log();
        this.game.state.start("Boot", true, false, "assets/levels/preparation_level.json", "Preparation", { battle_id: battle_id, local_player: "player2", remote_player: "player1" });
    }

}