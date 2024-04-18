import { get, save } from "./filesMethods.js";
import inquirer from "inquirer";
import { promptNewExpenses } from "./expensesPrompts.js";
import chalk from "chalk";

const main = async () => {
    let run = true;
    while (run) {
        const action = await inquirer.prompt([
            {
                type: "list",
                name: "chosen",
                message: "Elija una acción:",
                choices: [
                    { value: 1, name: "Registrar una nueva compra" },
                    { value: 2, name: "Ver todas las compras" },
                    { value: 3, name: "Eliminar una compra" },
                    { value: 99, name: "Salir" }
                ],
            },
        ]);

        switch (action.chosen) {
            case 1:
                await registerNewExpense();
                break;
            case 2:
                await viewAllExpenses();
                break;
            case 3: // Agregamos el caso para eliminar una compra
                await deleteExpense();
                break;
            case 99:
                run = false;
                break;
            default:
                run = false;
                break;
        }
    }
    console.log("Gracias por utilizar el sistema de gestión de gastos.");
};

main();

const registerNewExpense = async () => {
    const newExpense = await promptNewExpenses();
    const expenses = await get("expenses");
    expenses.push(newExpense);
    await save("expenses", expenses);
    console.log(chalk.green("¡Gasto registrado con exito!"));
};


const viewAllExpenses = async () => {
    const expenses = await get("expenses");
    console.log(chalk.blue("Listado de gastos:"));
    console.table(expenses);

    const validExpenses = expenses.filter(expense => typeof expense['monto'] === 'number' && !isNaN(expense['monto']));
    console.log("Montos de las compras:", validExpenses.map(expense => expense['monto']));

    const total = validExpenses.reduce((total, expense) => total + expense['monto'], 0);
    console.log(chalk.blue("Total de gastos: $", total));
}

const deleteExpense = async () => {
    const expenses = await get("expenses");
    
    if (expenses.length === 0) {
        console.log(chalk.yellow("No hay gastos registrados."));
        return;
    }
    
    const choices = expenses.map((expense, index) => ({
        value: index,
        name: `${index + 1}. ${expense['title-expense']} - Monto: ${expense['monto']} - Fecha: ${expense['Fecha']}`
    }));

    const chosenExpense = await inquirer.prompt([
        {
            type: "list",
            name: "expenseIndex",
            message: "Seleccione el gasto que desea eliminar:",
            choices: choices
        }
    ]);

    const indexToDelete = chosenExpense.expenseIndex;
    const expenseToDelete = expenses[indexToDelete];


    const confirmDelete = await inquirer.prompt([
        {
            type: "confirm",
            name: "confirmation",
            message: `¿Está seguro que desea eliminar el gasto "${expenseToDelete['title-expense']}"?`
        }
    ]);

    if (confirmDelete.confirmation) {
        expenses.splice(indexToDelete, 1);
        await save("expenses", expenses);
        console.log(chalk.green(`¡El gasto "${expenseToDelete['title-expense']}" ha sido eliminado correctamente!`));
    } else {
        console.log(chalk.yellow("Operación de eliminación cancelada."));
    }
};