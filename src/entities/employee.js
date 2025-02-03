export default class Employee {
    static classMap = {
        Employee: Employee,
        Manager: null,
        WageEmployee: null,
        SalesPerson: null,
    }

    constructor(id = 0, department = null, basicSalary = 0, className) {
        this.basicSalary = basicSalary;
        this.department = department;
        this.id = id;
        this.className = className || "Employee";
    }

    computeSalary() {
        return this.basicSalary;
    }

    getId() {
        return this.id;
    }

    getBasicSalary() {
        return this.basicSalary
    }

    getDepartment() {
        return this.department
    }

    static createFromObject(obj) {
        if (!obj.className) {
            throw new Error(`Missing className in employee object: ${JSON.stringify(obj)}`);
        }

        const EmployeeClass = Employee.classMap[obj.className];
        if (!EmployeeClass) {
            throw new Error(`Unknown employee type: ${obj.className}`);
        }
        return new EmployeeClass(...Object.values(obj));
    }
}