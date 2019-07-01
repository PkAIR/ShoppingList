class ToDoList {
    constructor(listOfItems) {
        this._listOfItems = listOfItems;

        this.getToDoList = () => {
            return this._listOfItems;
        };

        this.addItem = (item) => {
            this._listOfItems.push(item);
        };

        this.deleteItem = (item) => {
            this._listOfItems = this._listOfItems.filter((elem) => {
                return elem != item;
            });
        };

        this.deleteToDoList = () => {
            this._listOfItems = [];
        };
    }
};

module.exports = ToDoList;