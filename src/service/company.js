import Employee from '../entities/employee.js';
import Manager from '../entities/manager.js'
import { readFile, writeFile } from 'node:fs/promises';

export default class Company {
    #employees
    #departments
    constructor() {
        this.#employees = {};
        this.#departments = {};
    }

    async addEmployee(employee) {
        if (!(employee instanceof Employee)) {
            throw new Error("Invalid employee object");
        }

        if ((await this.getEmployee(employee.id))) {
            throw new Error("Employee already exists");
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
        delete this.#departments[this.#employees[id].department];
        delete this.#employees[id];
    }

    async getDepartmentBudget(department) {
        return this.#departments[department].reduce((acc, emp) => acc + emp.computeSalary(), 0);
    }

    async getDepartments() {
        return Object.keys(this.#departments).toSorted();
    }

    async getManagersWithMostFactor() {
        return Object.values(this.#employees).filter(emp => emp instanceof Manager).sort((a, b) => b.getFactor() - a.getFactor());
    }

    async saveToFile(fileName) {
        await writeFile(fileName, this.#employees);
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