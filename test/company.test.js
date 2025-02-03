import { describe, it, expect, beforeEach, vi } from 'vitest';
import { writeFile, readFile } from 'node:fs/promises';
import Company from '../src/service/company.js';
import Employee from '../src/entities/employee.js';
import Manager from '../src/entities/manager.js';
import SalesPerson from '../src/entities/salesPerson.js';
import WageEmployee from '../src/entities/wageEmployee.js';

vi.mock('node:fs/promises', () => ({
    writeFile: vi.fn(() => Promise.resolve()),
    readFile: vi.fn(() => Promise.resolve(JSON.stringify({
        "1": { id: 1, department: "QA", basicSalary: 5000, className: "Employee" },
        "2": { id: 2, department: "HR", basicSalary: 9000, factor: 1.5, className: "Manager" },
        "3": { id: 3, department: "Sales", basicSalary: 5000, wage: 10, hours: 40, percent: 5, sales: 10000, className: "SalesPerson" },
        "4": { id: 4, department: "IT", basicSalary: 5000, wage: 10, hours: 40, className: "WageEmployee" }
    })))
}));

describe('Company Class', () => {
    let company;
    let emp1, emp2, manager;

    beforeEach(() => {
        company = new Company();
        emp1 = new Employee(1, "QA", 5000, "Employee");
        emp2 = new Employee(2, "DEV", 7000, "Employee");
        manager = new Manager(3, "DATA", 9000, 1.5, "Manager");
    });

    it('should add an employee', async () => {
        await company.addEmployee(emp1);
        expect(await company.getEmployee(emp1.id)).toEqual(emp1);
    });
    it('should throw an error when adding an invalid employee', async () => {
        await expect(company.addEmployee({ id: 4 })).rejects.toThrow("Invalid employee object");
    });

    it('should remove an employee', async () => {
        await company.addEmployee(emp1);
        await company.removeEmployee(emp1.id);
        expect(await company.getEmployee(emp1.id)).toBeUndefined();
    });

    it('should get managers sorted by factor', async () => {
        await company.addEmployee(emp1);
        await company.addEmployee(manager);
        const managers = await company.getManagersWithMostFactor();
        expect(managers).toEqual([manager]);
    });

    it('should calculate department budget', async () => {
        company.setDepartments({
            "IT": [emp1, emp2]
        });
        expect(await company.getDepartmentBudget("IT")).toBe(12000);
    });

    it('should set departments', async () => {
        const departments = {
            "IT": [emp1, emp2],
            "HR": [manager]
        };
        company.setDepartments(departments);
        expect(await company.getDepartments()).toEqual(departments);
    });

    it('should save employees to a file', async () => {
        await company.addEmployee(emp1);
        await company.saveToFile('test.json');
        expect(writeFile).toHaveBeenCalledWith('test.json', { "1": emp1 });
    });

    it('should restore employees from a file', async () => {
        await company.restoreFromFile('test.json');

        const restoredEmployee = await company.getEmployee(1);

        expect(restoredEmployee).toBeInstanceOf(Employee);
        expect(restoredEmployee).toEqual(expect.objectContaining({
            id: 1,
            className: "Employee",
            department: "QA",
            basicSalary: 5000
        }));
    });

    it('should restore employees as the correct class types', async () => {
        await company.restoreFromFile('employees.json');

        const emp1 = await company.getEmployee(1);
        const emp2 = await company.getEmployee(2);
        const emp3 = await company.getEmployee(3);
        const emp4 = await company.getEmployee(4);

        expect(emp1).toBeInstanceOf(Employee);
        expect(emp2).toBeInstanceOf(Manager);
        expect(emp3).toBeInstanceOf(SalesPerson);
        expect(emp4).toBeInstanceOf(WageEmployee);
    });

});