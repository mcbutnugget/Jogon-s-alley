class entitySettings{
    constructor(){
        this.setId=(value)=>{
            this.id = value.replace(/([A-Z])/g,"_$1").toLowerCase();
            return this;
        };
        this.type = (value)=>{
            this.type = value;
            return this;
        }
    }

}

export default entitySettings;