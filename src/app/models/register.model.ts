
export class Register {

    public format: string;
    public text: string;
    public type: string;
    public icon: string;
    public created: Date;

    constructor( format: string, text: string ) {
        this.format = format;
        this.text = text;
        this.created = new Date();
        this.getType();
    }

    private getType() {
        const initValue = this.text.substr(0, 4);
        switch ( initValue ) {
            case 'http':
                this.type = 'http';
                this.icon = 'globe';
                break;
            case 'geo:':
                this.type = 'geo';
                this.icon = 'pin';
                break;
            default:
                this.type = 'Not found';
                this.icon = 'create';
        }
    }

}