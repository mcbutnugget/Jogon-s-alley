class Settings{
    constructor(){
        this.slipperiness = 0.6;
        this.velocityMultiplier = 1.0;
        this.jumpVelocityMultiplier = 1.0;

        this.setToughness=(value = 2)=>{
            this.toughness = value;
            return this;
        };
        this.setId=(value)=>{
            this.id = value.replace(/([A-Z])/g,"_$1").toLowerCase();
            return this;
        };
        this.setResistance=(value = 2)=>{
            this.resistance = value;
            return this;
        };
    }

}

export default Settings;