import inquirer from "inquirer";
import datePrompt from "inquirer-date-prompt"

inquirer.registerPrompt("date", datePrompt);

export async function promptNewExpenses() {
    return await inquirer.prompt(newExpensePrompt);
};

const newExpensePrompt = [
    {
        type: 'input',
        name: 'title-expense',
        message: 'Ingrese el Titulo de la compra:'
    },
    {
        type: 'number',
        name: 'monto',
        message: 'Ingrese el monto de la compra:'
    },
    {
        type: 'date',
        name: 'Fecha',
        message: 'Ingrese la fecha de la compra:'
    },
    {
        type: 'list',
        name: 'category-expense',
        message: 'Seleccione la categoría de la compra:',
        choices: ['Alimentación', 'Transporte', 'Ocio', 'Hogar', 'Otros']
    },
    {
        type: 'confirm',
        name: 'confirm-expense',
        message: '¿Está seguro de registrar esta compra?',
        default: true
    }
];