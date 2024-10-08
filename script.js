function setupTabNavigation() {
      const tabItems = document.querySelectorAll('.tab-item');
      tabItems.forEach(item => {
        item.addEventListener('click', () => {
          const pageId = item.getAttribute('data-page');
          showPage(pageId);
        });
      });
    }

    let currentPoints = 1000;
    let gamesPlayed = 0;
    let pointsEarned = 0;
    let rewardsClaimed = 0;
    let rewardsCatalog = [
      { id: 1, name: '500 Mo de data', points: 1000, tier: 'Bronze' },
      { id: 2, name: '1 Go de data', points: 2000, tier: 'Silver' },
      { id: 3, name: '5000 FCFA de crédit', points: 5000, tier: 'Gold' },
      { id: 4, name: 'Smartphone d\'entrée de gamme', points: 10000, tier: 'Platinum' }
    ];
    let redeemedRewards = [];

    document.addEventListener('DOMContentLoaded', function() {
      updatePointsDisplay();
      simulateDataLoading();
      setupEventListeners();
      setupTabNavigation();
      setupTreasureHuntGame();
      setupSpinWheelGame();
      setupImageCarousel();
      setupMenu();
      setupSocialSharing();
      setupAccountCreation();
      setupProfileLogic();
      updateAvailableRewards();
      updateRewardsProgress();
      updateRewardsHistory();
    });

    function updatePointsDisplay() {
      document.getElementById('pointsBalance').textContent = currentPoints + " points";
      document.dispatchEvent(new Event('pointsUpdated'));
    }

    function simulateDataLoading() {
      setTimeout(() => {
        loadUserProfile();
        updatePointsDisplay();
      }, 1000);
    }

    function setupEventListeners() {
      document.getElementById('playButton').addEventListener('click', function() {
        showPage('games-page');
      });

      document.getElementById('earnPointsButton').addEventListener('click', function() {
        alert("Voici comment gagner plus de points :\n- Invitez des amis\n- Complétez votre profil\n- Participez aux défis quotidiens");
      });

      document.querySelector('.menu-icon').addEventListener('click', function() {
        const mainMenu = document.getElementById('main-menu');
        mainMenu.classList.remove('hidden');
        mainMenu.classList.add('active');
      });

      document.getElementById('editProfileButton').addEventListener('click', function() {
        const profileInfo = document.getElementById('profile-info');
        const editProfileForm = document.getElementById('edit-profile-form');
        profileInfo.classList.add('hidden');
        editProfileForm.classList.remove('hidden');
        populateEditForm();
      });
      
      document.getElementById('cancelEditProfile').addEventListener('click', () => {
        document.getElementById('profile-info').classList.remove('hidden');
        document.getElementById('edit-profile-form').classList.add('hidden');
      });

      document.addEventListener('pointsUpdated', function() {
        updateAvailableRewards();
        updateRewardsProgress();
      });
    }

    function showPage(pageId) {
      const pages = document.querySelectorAll('.content > div');
      pages.forEach(page => {
        page.classList.add('hidden');
      });
      const newPage = document.getElementById(pageId);
      newPage.classList.remove('hidden');
      newPage.classList.add('fade-in');
    }

    function setupMenu() {
      const menuIcon = document.querySelector('.menu-icon');
      const mainMenu = document.getElementById('main-menu');
      const closeMenu = document.getElementById('close-menu');

      closeMenu.addEventListener('click', () => {
        mainMenu.classList.remove('active');
        setTimeout(() => mainMenu.classList.add('hidden'), 300);
      });
    }

    function setupSocialSharing() {
      const shareButtons = document.querySelectorAll('.share-button');
      shareButtons.forEach(button => {
        button.addEventListener('click', () => {
          const platform = button.getAttribute('data-platform');
          const url = encodeURIComponent(window.location.href);
          const text = encodeURIComponent("Jouez et gagnez des prix avec MTN Bénin !");
          let shareUrl;

          switch (platform) {
            case 'facebook':
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
              break;
            case 'twitter':
              shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
              break;
            case 'whatsapp':
              shareUrl = `https://wa.me/?text=${text}%20${url}`;
              break;
          }

          window.open(shareUrl, '_blank');
        });
      });
    }

    function setupAccountCreation() {
      const form = document.getElementById('create-account-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('new-username').value;
        const phone = document.getElementById('new-phone').value;
        const password = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
          alert("Les mots de passe ne correspondent pas.");
          return;
        }

        console.log("Nouveau compte:", { username, phone, password });
        alert("Compte créé avec succès !");
        form.reset();
        showPage('home-page');
      });
    }

    function setupTreasureHuntGame() {
      const startButton = document.getElementById('startTreasureHunt');
      const gameContainer = document.getElementById('treasure-hunt-game');
      const grid = document.getElementById('treasure-grid');
      const clicksLeftSpan = document.getElementById('clicks-left');
      const rewardBar = document.getElementById('reward-progress-bar');
      let clicksLeft = 5;
      let treasureFound = false;
      let treasurePosition;

      startButton.addEventListener('click', function() {
        gameContainer.classList.remove('hidden');
        startButton.classList.add('hidden');
        initializeGame();
      });

      function initializeGame() {
        grid.innerHTML = '';
        clicksLeft = 5;
        treasureFound = false;
        treasurePosition = Math.floor(Math.random() * 9);
        clicksLeftSpan.textContent = clicksLeft;
        rewardBar.style.width = '0%';

        for (let i = 0; i < 9; i++) {
          const cell = document.createElement('div');
          cell.classList.add('game-cell');
          cell.textContent = '?';
          cell.addEventListener('click', () => onCellClick(cell, i));
          grid.appendChild(cell);
        }
      }

      function onCellClick(cell, index) {
        if (treasureFound || clicksLeft <= 0) return;

        clicksLeft--;
        clicksLeftSpan.textContent = clicksLeft;

        if (index === treasurePosition) {
          cell.textContent = '💎';
          treasureFound = true;
          endGame(true);
        } else {
          cell.textContent = '❌';
          if (clicksLeft === 0) {
            endGame(false);
          }
        }

        updateRewardBar();
      }

      function updateRewardBar() {
        const progress = ((5 - clicksLeft) / 5) * 100;
        rewardBar.style.width = `${progress}%`;
      }

      function endGame(won) {
        if (won) {
          alert("Félicitations ! Vous avez trouvé le trésor et gagné 500 points !");
          currentPoints += 500;
          pointsEarned += 500;
        } else {
          alert("Dommage ! Vous n'avez pas trouvé le trésor. Essayez encore !");
        }
        gamesPlayed++;
        updatePointsDisplay();
        document.getElementById('games-played').textContent = gamesPlayed;
        document.getElementById('points-earned').textContent = pointsEarned;
        setTimeout(() => {
          gameContainer.classList.add('hidden');
          startButton.classList.remove('hidden');
        }, 2000);
      }
    }

    function setupSpinWheelGame() {
      const startButton = document.getElementById('startSpinWheel');
      const gameContainer = document.getElementById('spin-wheel-game');
      const spinButton = document.getElementById('spin-button');
      const resultDisplay = document.getElementById('spin-result');
      const canvas = document.getElementById('wheel');
      const ctx = canvas.getContext('2d');

      const prizes = ['100 points', '200 points', '500 points', '1000 points', 'Essayez encore', 'Bonus surprise'];
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

      startButton.addEventListener('click', function() {
        gameContainer.classList.remove('hidden');
        startButton.classList.add('hidden');
        drawWheel();
      });

      spinButton.addEventListener('click', spinWheel);

      function drawWheel() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2 - 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < prizes.length; i++) {
          const angle = (i / prizes.length) * 2 * Math.PI;
          const endAngle = ((i + 1) / prizes.length) * 2 * Math.PI;

          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, angle, endAngle);
          ctx.closePath();

          ctx.fillStyle = colors[i];
          ctx.fill();

          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle + (1 / prizes.length) * Math.PI);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#fff';
          ctx.font = '12px Arial';
          ctx.fillText(prizes[i], radius - 10, 5);
          ctx.restore();
        }
      }

      function spinWheel() {
        const rotations = 5;
        const degreesPerPrize = 360 / prizes.length;
        const randomDegrees = Math.floor(Math.random() * 360);
        const totalDegrees = rotations * 360 + randomDegrees;
        let currentRotation = 0;

        function rotate() {
          currentRotation += 10;
          if (currentRotation <= totalDegrees) {
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((currentRotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            drawWheel();
            ctx.restore();
            requestAnimationFrame(rotate);
          } else {
            const prizeIndex = Math.floor(randomDegrees / degreesPerPrize);
            const prize = prizes[prizeIndex];
            resultDisplay.textContent = `Vous avez gagné : ${prize}`;
            if (prize.includes('points')) {
              const points = parseInt(prize);
              currentPoints += points;
              pointsEarned += points;
              updatePointsDisplay();
              document.getElementById('points-earned').textContent = pointsEarned;
            }
            gamesPlayed++;
            document.getElementById('games-played').textContent = gamesPlayed;
          }
        }

        rotate();
      }
    }

    function setupImageCarousel() {
      const carousel = document.querySelector('.carousel-container');
      const slides = document.querySelectorAll('.carousel-slide');
      const prevButton = document.querySelector('.carousel-button.prev');
      const nextButton = document.querySelector('.carousel-button.next');
      let currentSlide = 0;

      function showSlide(index) {
        carousel.style.transform = `translateX(-${index * 100}%)`;
      }

      prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });

      nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });

      setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      }, 5000);
    }

    function setupProfileLogic() {
      const editProfileButton = document.getElementById('editProfileButton');
      const cancelEditProfileButton = document.getElementById('cancelEditProfile');
      const editProfileForm = document.getElementById('edit-profile-form');
      const profileInfo = document.getElementById('profile-info');

      editProfileButton.addEventListener('click', () => {
        profileInfo.classList.add('hidden');
        editProfileForm.classList.remove('hidden');
        populateEditForm();
      });

      cancelEditProfileButton.addEventListener('click', () => {
        profileInfo.classList.remove('hidden');
        editProfileForm.classList.add('hidden');
      });

      editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateProfile();
      });

      loadUserProfile();
    }

    function populateEditForm() {
      const nameInput = document.getElementById('edit-name');
      const numberInput = document.getElementById('edit-number');
      
      nameInput.value = document.getElementById('user-name').textContent;
      numberInput.value = document.getElementById('user-number').textContent;
    }

    function updateProfile() {
      const newName = document.getElementById('edit-name').value;
      const newNumber = document.getElementById('edit-number').value;

      document.getElementById('user-name').textContent = newName;
      document.getElementById('user-number').textContent = newNumber;

      localStorage.setItem('userName', newName);
      localStorage.setItem('userNumber', newNumber);

      showNotification('Profil mis à jour avec succès!');

      document.getElementById('profile-info').classList.remove('hidden');
      document.getElementById('edit-profile-form').classList.add('hidden');
    }

    function loadUserProfile() {
      const userName = localStorage.getItem('userName') || 'Jean Dupont';
      const userNumber = localStorage.getItem('userNumber') || '+229 97123456';
      const userLevel = localStorage.getItem('userLevel') || 'Silver';

      document.getElementById('user-name').textContent = userName;
      document.getElementById('user-number').textContent = userNumber;
      document.getElementById('user-level').textContent = userLevel;
    }

    function showNotification(message) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.position = 'fixed';
      notification.style.top = '20px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.backgroundColor = 'var(--mtn-blue)';
      notification.style.color = 'white';
      notification.style.padding = '10px 20px';
      notification.style.borderRadius = '5px';
      notification.style.zIndex = '1000';

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    }

    function redeemReward(rewardId) {
      const reward = rewardsCatalog.find(r => r.id === rewardId);
      if (reward && currentPoints >= reward.points) {
        currentPoints -= reward.points;
        redeemedRewards.push({ ...reward, date: new Date().toLocaleDateString() });
        updatePointsDisplay();
        updateRewardsHistory();
        showNotification(`Vous avez échangé ${reward.points} points contre ${reward.name} !`);
      } else {
        showNotification('Points insuffisants pour échanger cette récompense.');
      }
    }

    function updateRewardsHistory() {
      const historyList = document.getElementById('rewards-history');
      historyList.innerHTML = '';
      redeemedRewards.forEach(reward => {
        const li = document.createElement('li');
        li.textContent = `${reward.date} : ${reward.name} échangé`;
        historyList.appendChild(li);
      });
    }

    function updateAvailableRewards() {
      const rewardsList = document.getElementById('rewards-list');
      rewardsList.innerHTML = '';
      rewardsCatalog.forEach(reward => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${reward.name} (${reward.points} points)
          <button class="button" onclick="redeemReward(${reward.id})" 
                  ${currentPoints < reward.points ? 'disabled' : ''}>
            Échanger
          </button>
        `;
        rewardsList.appendChild(li);
      });
    }

    function updateRewardsProgress() {
      const progressBar = document.createElement('div');
      progressBar.className = 'rewards-progress';
      progressBar.innerHTML = `
        <h3>Progression des récompenses</h3>
        <div class="progress-bar">
          <div class="progress" style="width: ${(currentPoints / 10000) * 100}%"></div>
        </div>
        <p>Niveau actuel : ${getCurrentTier()}</p>
        <p>Points pour le prochain niveau : ${getPointsToNextTier()}</p>
      `;
      document.getElementById('rewards-page').insertBefore(progressBar, document.getElementById('rewards-page').firstChild);
    }

    function getCurrentTier() {
      if (currentPoints >= 10000) return 'Platinum';
      if (currentPoints >= 5000) return 'Gold';
      if (currentPoints >= 2000) return 'Silver';
      return 'Bronze';
    }

    function getPointsToNextTier() {
      if (currentPoints < 2000) return 2000 - currentPoints;
      if (currentPoints < 5000) return 5000 - currentPoints;
      if (currentPoints < 10000) return 10000 - currentPoints;
      return 0;
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
          console.log('Service Worker enregistré avec succès');
        })
        .catch(function(error) {
          console.log('Erreur lors de l\'enregistrement du Service Worker:', error);
        });
    }
  