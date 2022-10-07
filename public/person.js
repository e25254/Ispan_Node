export default class Person {
    gender = 'male'
    constructor(name = 'noname', age = 0) {
        this.name = name;
        this.age = age;
    }
    toJSON() {
        const { name, age, gender } = this;
        return { name, age, gender }
    }
    toString() {
        return JSON.stringify(this)
    }
}

export const a = 10
const f = n => n * n

export { f }

// const p1 = new Person('David', 25)

// console.log(JSON.stringify(p1));
// console.log(p1);
// console.log(p1 + '');