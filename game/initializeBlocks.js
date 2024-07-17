import Block from './blocks/Block.js'
import Settings from './data/Settings.js'

class REGISTER {
    blocks = {};
    blockIds = [null];
    constructor(){
    this.blocks.stone=new Block(new Settings().setResistance(5).setId("stone"));
    this.blocks.dirt=new Block((new Settings()).setResistance(1).setId("dirt"));
    this.blocks.grass = new Block(new Settings().setResistance(1).setId("grass"));
    this.blocks.deepStone = new Block(new Settings().setResistance(99).setId("deep_stone"));
    this.blockIds.push("stone");
    this.blockIds.push("dirt");
    this.blockIds.push("grass");
    this.blockIds.push("deep_stone");
    }
}

export default REGISTER;