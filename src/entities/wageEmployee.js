import Employee from "./employee.js";
export default class WageEmployee extends Employee {

    static {
        Employee.classMap.WageEmployee = WageEmployee;
    }

    constructor(id, department, basicSalary, wage = 0, hours = 0, className) {
        super(id, department, basicSalary, className ?? "WageEmployee");
        this.wage = wage;
        this.hours = hours;
    }

    getWage() {
        return this.wage;
    }

    getHours() {
        return this.hours
    }

    computeSalary() {
        return super.computeSalary() + this.hours * this.wage
    }

}