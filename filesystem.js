const initialFilesystem = {
    name: "C:",
    type: "dir",
    children: {
        "Escape": {
            type: "dir",
            children: {
                "readme.txt": {
                    type: "file",
                    hidden: false,
                    content: "Vítej v únikovce! Cílem je dosáhnout finálního Levelu 5.\nPro postup do Levelu 2 zadej: runas /user:level2\nHeslo: heslo123"
                },
                "secret.txt": {
                    type: "file",
                    hidden: true,
                    content: "Level 2 splněn!\nPro postup do Levelu 3 zadej: runas /user:level3\nHeslo: tajneheslo"
                },
                "system.log": {
                    type: "file",
                    hidden: false,
                    content: "10:00 Start systému\n10:05 Spuštění sítě\n10:20 Chyba přihlášení uživatele host\n11:00 Bezpečnostní audit: heslo pro level4 je klic2026\n11:15 Záloha databáze dokončena\n11:30 Kontrola služeb OK"
                },
                "security": {
                    type: "dir",
                    children: {
                        "vault": {
                            type: "dir",
                            children: {
                                "hesla.txt": {
                                    type: "file",
                                    hidden: false,
                                    content: "Level 4 splněn!\nPro dokončení hry a odemčení Levelu 5 zadej:\nrunas /user:level5\nHeslo: hluboko"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
