import Employee from '../entities/employee.js';
import Manager from '../entities/manager.js'
import { readFile, writeFile } from 'node:fs/promises';
import EmployeeError from '../exceptions/employeeError.js';

export default class Company {
    #employees;
    #departments;
    #predicate;
    constructor(predicate) {
        this.#employees = {};
        this.#departments = {};
        this.setPredicate(predicate);
        this.#setIterable();
    }

    #setIterable() {
        this[Symbol.asyncIterator] = async function* () {
            const values = Object.values(this.#employees);
            let indexCur = -1;

            while (true) {
                const { index, value } = this.#getNext(indexCur, values);
                if (!value) {
                    break;
                }
                yield value;
                indexCur = index;
            }
        }
    }

    #getNext(index, values) {
        let value;
        index++;
        while ((value = values[index]) && !this.#predicate(value)) {
            index++;
        }
        return { index, value };
    }
    
    setPredicate(predicate) {
        this.#predicate = predicate ?? (e => true);
    }

    async addEmployee(employee) {
        if (!(employee instanceof Employee)) {
            throw new EmployeeError("INVALID_EMPLOYEE");
        }

        if ((await this.getEmployee(employee.id))) {
            throw new EmployeeError("EMPLOYEE_EXISTS", `ID: ${employee.id}`);
        }

        if (!(this.#departments[employee.department])) {
            this.#departments[employee.department] = [];
        }


        this.#employees[employee.id] = employee;
        this.#departments[employee.department].push(employee);
    }

    async getEmployee(id) {
        return this.#employees[id];
    }

    async removeEmployee(id) {

        if (!this.#employees[id]) {
            throw new EmployeeError("EMPLOYEE_NOT_FOUND", `ID: ${id}`);
        }

        this.#removeDepartments(this.#employees[id]);
        delete this.#employees[id];
    }
    #removeDepartments(employee) {
        const employees = this.#departments[employee.department];
        const index = employees.findIndex(e => e.id === employee.id);
        employees.splice(index, 1);
        employees.length == 0 && delete this.#departments[employee.department];
    }

    async getDepartmentBudget(department) {
        return this.#departments[department].reduce((acc, emp) => acc + emp.computeSalary(), 0);
    }

    async getDepartments() {
        return Object.keys(this.#departments).toSorted();
    }

    async getManagersWithMostFactor() {
        const managers = Object.values(this.#employees).filter(emp => emp instanceof Manager).sort((a, b) => b.getFactor() - a.getFactor());
        const res = [];
        let index = 0;
        if (managers.length > 0) {
            const maxFactor = managers[0].getFactor();
            while (
                index < managers.length &&
                managers[index].getFactor() == maxFactor
            ) {
                res.push(managers[index]);
                index++;
            }
        }
        return res;
    }

    async saveToFile(fileName) {
        const employeesJSON = JSON.stringify(Object.values(this.#employees));
        await writeFile(fileName, employeesJSON, 'utf8');
    }

    async restoreFromFile(fileName) {
        const data = await readFile(fileName, 'utf-8');
        const parsedEmployees = JSON.parse(data);

        this.#employees = Object.fromEntries(
            Object.entries(parsedEmployees).map(([id, emp]) =>
                [id, Employee.createFromObject(emp)]
            )
        );
    }

}