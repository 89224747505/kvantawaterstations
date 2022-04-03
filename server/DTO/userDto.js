module.exports = class UserDto {
    email;
    id;
    isActivated;
    role;
    phone;
    messageSms;

    constructor(model) {
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.isActivated;
        this.role = model.role;
        this.phone = model.phone;
        this.messageSms = model.messageSms;
    }
}