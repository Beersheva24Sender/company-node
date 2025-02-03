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
        this.#employees[employee.id] = employee;
    }

    async getEmployee(id) {
        return this.#employees[id];
    }

    async removeEmployee(id) {
        delete this.#employees[id];
    }

    async getDepartmentBudget(department) {
        return this.#departments[department].reduce((acc, emp) => acc + emp.computeSalary(), 0);
    }

    async setDepartments(departments) {
        this.#departments = departments;
    }

    async getDepartments() {
        return this.#departments;
    }

    async getManagersWithMostFactor() {
        return Object.values(this.#employees).filter(emp => emp instanceof Manager).sort((a, b) => b.getFactor() - a.getFactor());
    }

    async saveToFile(fileName) {
        await writeFile(fileName, JSON.stringify(this.#employees));
    }

    async restoreFromFile(fileName) {
        return await readFile(fileName, 'utf-8').then(data => {
            this.#employees = JSON.parse(data);
        });
    }

}