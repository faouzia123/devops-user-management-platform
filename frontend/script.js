// URL de base de notre API backend
// Le service backend est accessible via le nom de service 'backend' sur le port 80 (par défaut pour Apache)
// Si vous avez configuré un port différent pour le backend dans docker-compose.yml, ajustez ici.
const API_BASE_URL = 'http://localhost/api.php'; // Pour le développement, nous utiliserons localhost

// Fonction pour récupérer et afficher les utilisateurs depuis l'API
async function displayUsers( ) {
    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // Vider la liste actuelle

    try {
        const response = await fetch(API_BASE_URL); // Requête GET à l'API
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const users = await response.json(); // Convertir la réponse en JSON

        if (users.length === 0) {
            userList.innerHTML = '<li class="empty-message">Aucun utilisateur ajouté pour le moment.</li>';
            return;
        }

        // Afficher chaque utilisateur
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="user-item">
                    <div class="user-info">
                        <span class="user-name">${user.first_name} ${user.last_name}</span>

                        <small>Ajouté le: ${new Date(user.created_at).toLocaleDateString('fr-FR')}</small>
                    </div>
                    <button onclick="removeUser(${user.id})" style="background-color: #e74c3c; padding: 5px 10px; font-size: 12px;">
                        Supprimer
                    </button>
                </div>
            `;
            userList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        userList.innerHTML = '<li class="empty-message" style="color: red;">Erreur de chargement des utilisateurs.</li>';
    }
}

// Fonction pour ajouter un utilisateur via l'API
async function addUser(firstName, lastName) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Erreur HTTP: ${response.status}`);
        }

        console.log('Utilisateur ajouté:', result);
        alert(`Utilisateur ${firstName} ${lastName} ajouté avec succès !`);
        displayUsers(); // Recharger la liste après l'ajout
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
        alert(`Erreur lors de l\'ajout de l\'utilisateur: ${error.message}`);
    }
}

// Fonction pour supprimer un utilisateur via l'API
async function removeUser(userId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        return; // Annuler la suppression si l'utilisateur ne confirme pas
    }

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: userId })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Erreur HTTP: ${response.status}`);
        }

        console.log('Utilisateur supprimé:', result);
        alert('Utilisateur supprimé avec succès !');
        displayUsers(); // Recharger la liste après la suppression
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        alert(`Erreur lors de la suppression de l\'utilisateur: ${error.message}`);
    }
}

// Gestion du formulaire
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');

    // Afficher la liste au chargement de la page
    displayUsers();

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Empêcher le rechargement de la page

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();

        // Vérifier que les champs ne sont pas vides
        if (firstName === '' || lastName === '') {
            alert('Veuillez remplir tous les champs !');
            return;
        }

        // Ajouter l'utilisateur via l'API
        await addUser(firstName, lastName);

        // Vider le formulaire
        firstNameInput.value = '';
        lastNameInput.value = '';

        // Remettre le focus sur le premier champ
        firstNameInput.focus();
    });

    // Mettre le focus sur le premier champ au chargement
    firstNameInput.focus();
});
