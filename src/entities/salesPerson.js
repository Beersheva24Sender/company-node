import WageEmployee from "./wageEmployee.js";
import Employee from "./employee.js";
export default class SalesPerson extends WageEmployee {

    static {
        Employee.classMap.SalesPerson = SalesPerson;
    }

    constructor(id, department, basicSalary, wage, hours, percent = 0, sales = 0, className) {
        super(id, department, basicSalary, wage, hours, className ?? "SalesPerson");
        this.percent = percent;
        this.sales = sales;
    }

    getPercent() {
        return this.percent;
    }

    getSales() {
        return this.sales
    }

    computeSalary() {
        return super.computeSalary() + this.sales * this.percent / 100
    }
}