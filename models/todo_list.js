const uuidv1 = require('uuid/v1');

class ToDoList {
    constructor(dictOfItems) {
        this._dictOfItems = dictOfItems;

        this.getToDoList = () => {
            return this._dictOfItems;
        };

        this.addItem = (value) => {
            let guid = uuidv1();
            this._dictOfItems[guid] = value;
        };

        this.addItems = (values) => {
            for (var key in values) {
                this._dictOfItems[key] = values[key];
            }            
        };

        this.getItemByValue = (value) => {
            for (var item in this._dictOfItems) {
                if (this._dictOfItems[item] == value) {
                    return {
                        key: item, 
                        value: value
                    };
                }
            }
        };

        this.deleteItem = (item) => {
            delete this._dictOfItems[item];
        };

        this.hasItem = (item) => {
            return item in this._dictOfItems;
        };

        this.deleteToDoList = () => {
            this._dictOfItems = {};
        };
    }
};

module.exports = ToDoList;