const passwords = {
    level2: "heslo123",
    level3: "tajneheslo",
    level4: "klic2026",
    level5: "hluboko"
};

let currentPath = ["C:", "Escape"];
let waitingForPassword = false;
let pendingUser = null;

const terminal = document.getElementById("terminal");
const output = document.getElementById("output");
const promptEl = document.getElementById("prompt");
const input = document.getElementById("commandInput");

function print(text) {
    const div = document.createElement("div");
    div.className = "line";
    div.textContent = text;
    output.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
}

function updatePrompt() {
    if (waitingForPassword) {
        promptEl.textContent = "Heslo pro " + pendingUser + ": ";
        input.type = "password";
    } else {
        promptEl.textContent = currentPath.join("\\") + ">";
        input.type = "text";
    }
}

function resolvePathArray(pathStr) {
    let clean = pathStr.replace(/\\/g, "/");
    let parts = clean.split("/").filter(p => p && p !== ".");
    let res = [...currentPath];

    if (clean.startsWith("C:") || clean.startsWith("/")) {
        res = ["C:"];
        if (parts[0] === "C:") parts.shift();
    }

    for (let p of parts) {
        if (p === "..") {
            if (res.length > 1) res.pop();
        } else {
            res.push(p);
        }
    }
    return res;
}

function getNode(pathArr) {
    let current = initialFilesystem;
    for (let i = 1; i < pathArr.length; i++) {
        if (!current.children || !current.children[pathArr[i]]) {
            return null;
        }
        current = current.children[pathArr[i]];
    }
    return current;
}

function executeCommand(cmdLine) {
    let tokens = cmdLine.split(/\s+/);
    let command = tokens[0].toLowerCase();
    let args = tokens.slice(1);

    switch (command) {
        case "help":
            print("Dostupné příkazy:");
            print("dir          - výpis souborů (použij 'dir /a' pro skryté soubory)");
            print("cd <složka>  - změna složky ('cd ..' pro návrat)");
            print("type <soubor>- zobrazení obsahu souboru");
            print("findstr <text> <soubor> - vyhledání textu v souboru");
            print("runas /user:<levelX>   - přihlášení do dalšího levelu");
            print("cls          - vymazání obrazovky");
            print("help         - nápověda");
            break;

        case "cls":
            output.innerHTML = "";
            break;

        case "dir":
            handleDir(args);
            break;

        case "cd":
            handleCd(args);
            break;

        case "type":
            handleType(args);
            break;

        case "findstr":
            handleFindstr(args);
            break;

        case "runas":
            handleRunas(args);
            break;

        case "echo":
            print(args.join(" "));
            break;

        default:
            print("Neznámý příkaz '" + command + "'. Napiš 'help' pro nápovědu.");
            break;
    }
}

function handleDir(args) {
    let showAll = args.some(a => a.toLowerCase() === "/a");
    let currentDir = getNode(currentPath);

    print("Obsah složky " + currentPath.join("\\") + ":");
    for (let name in currentDir.children) {
        let item = currentDir.children[name];
        if (item.hidden && !showAll) continue;

        if (item.type === "dir") {
            print("<DIR>  " + name);
        } else {
            print("       " + name);
        }
    }
}

function handleCd(args) {
    if (!args[0]) {
        print(currentPath.join("\\"));
        return;
    }

    let targetArr = resolvePathArray(args[0]);
    let targetNode = getNode(targetArr);

    if (targetNode && targetNode.type === "dir") {
        currentPath = targetArr;
        updatePrompt();
    } else {
        print("Cesta nenalezena.");
    }
}

function handleType(args) {
    if (!args[0]) {
        print("Použití: type <soubor>");
        return;
    }

    let fileArr = resolvePathArray(args[0]);
    let file = getNode(fileArr);

    if (!file) {
        print("Soubor nenalezen.");
    } else if (file.type === "dir") {
        print("Nelze otevřít složku jako text.");
    } else {
        print(file.content);
    }
}

function handleFindstr(args) {
    if (args.length < 2) {
        print("Použití: findstr <text> <soubor>");
        return;
    }

    let pattern = args[0].toLowerCase();
    let fileArr = resolvePathArray(args[1]);
    let file = getNode(fileArr);

    if (!file || file.type !== "file") {
        print("Soubor nenalezen: " + args[1]);
        return;
    }

    let lines = file.content.split("\n");
    let found = false;
    for (let line of lines) {
        if (line.toLowerCase().includes(pattern)) {
            print(line);
            found = true;
        }
    }
    if (!found) {
        print("Text '" + pattern + "' nenalezen.");
    }
}

function handleRunas(args) {
    let userArg = args[0] || "";
    let match = userArg.match(/\/user:(.+)/i);

    if (!match) {
        print("Použití: runas /user:<levelX>");
        return;
    }

    pendingUser = match[1].toLowerCase();
    waitingForPassword = true;
    updatePrompt();
}

function checkPassword(enteredPass) {
    if (passwords[pendingUser] && enteredPass.trim() === passwords[pendingUser]) {
        print("Přihlášení úspěšné pro uživatele " + pendingUser + ".");
        if (pendingUser === "level5") {
            print("=================================================");
            print("GRATULACE! Úspěšně jsi dokončil únikovku (Level 5)!");
            print("Získal jsi plná oprávnění a unikl z terminálu.");
            print("=================================================");
        }
    } else {
        print("Chyba: Nesprávné heslo.");
    }

    waitingForPassword = false;
    pendingUser = null;
    updatePrompt();
}

input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        let val = input.value;
        input.value = "";

        if (waitingForPassword) {
            print(promptEl.textContent + "********");
            checkPassword(val);
        } else {
            print(promptEl.textContent + val);
            if (val.trim()) {
                executeCommand(val.trim());
            }
        }
    }
});

terminal.addEventListener("click", function() {
    input.focus();
});

print("Windows Terminal [Úniková hra]");
print("Tvým cílem je dosáhnout finálního Levelu 5.");
print("Napiš 'help' pro nápovědu nebo 'dir' pro zobrazení souborů.\n");
updatePrompt();
