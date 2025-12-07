<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nom = trim($_POST["nom"]);
    $presence = $_POST["presence"];

    if (!empty($nom) && !empty($presence)) {
        try {
            $pdo = new PDO("mysql:host=localhost;dbname=dawin", "root", "");
            $pdo->exec("SET NAMES 'utf8'");

            $stmt = $pdo->prepare("INSERT INTO confirmations (nom, presence) VALUES (?, ?)");
            $stmt->execute([$nom, $presence]);

            echo "✅ Merci $nom, votre réponse ($presence) a été enregistrée.";
        } catch (PDOException $e) {
            echo "❌ Erreur de connexion : " . $e->getMessage();
        }
    } else {
        echo "⚠️ Veuillez remplir tous les champs.";
    }
}
?>