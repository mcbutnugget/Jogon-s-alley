import Block from './blocks/Block.js'
import Settings from './data/Settings.js'
//import Entity from './entities/Entity.js'
//import entitySettings from './data/entitySettings.js';

class REGISTER {
    blocks = {};
    blockIds = [null];

    entities = {};
    constructor(){
        //blocks
        this.blocks.stone=new Block(new Settings().setResistance(5).setId("stone"));
        this.blocks.dirt=new Block((new Settings()).setResistance(1).setId("dirt"));
        this.blocks.grass = new Block(new Settings().setResistance(1).setId("grass"));
        this.blocks.deepStone = new Block(new Settings().setResistance(99).setId("deep_stone"));
        this.blocks.deepStoneBricks = new Block(new Settings().setResistance(99).setId("deep_stone_bricks"))
        this.blockIds.push("stone");
        this.blockIds.push("dirt");
        this.blockIds.push("grass");
        this.blockIds.push("deep_stone");
        this.blockIds.push("deep_stone_bricks");

        //entities
   //     this.entities.player = new Entity(new entitySettings().setId("player"));
    }
}

export default REGISTER;