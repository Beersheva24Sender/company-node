import Employee from "./employee.js";

export default class Manager extends Employee {
    static {
        Employee.classMap.Manager = Manager;
    }

    constructor(id, department, basicSalary, factor, className) {
        super(id, department, basicSalary, className ?? "Manager");
        this.factor = factor;

    }

    getFactor() {
        return this.factor;
    }

    computeSalary() {
        return super.computeSalary() * this.factor;
    }

}