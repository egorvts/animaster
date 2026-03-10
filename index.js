addListeners();

function addListeners() {
    let heartBeatingHandler;

    document
        .getElementById("fadeInPlay")
        .addEventListener("click", function () {
            const block = document.getElementById("fadeInBlock");
            animaster().fadeIn(block, 5000);
        });

    document
        .getElementById("fadeOutPlay")
        .addEventListener("click", function () {
            const block = document.getElementById("fadeOutBlock");
            animaster().fadeOut(block, 5000);
        });

    document.getElementById("movePlay").addEventListener("click", function () {
        const block = document.getElementById("moveBlock");
        animaster().addMove(1000, {x: 100, y: 10}).play(block);
    });

    document.getElementById("scalePlay").addEventListener("click", function () {
        const block = document.getElementById("scaleBlock");
        animaster().scale(block, 1000, 1.25);
    });

    document
        .getElementById("moveAndHidePlay")
        .addEventListener("click", function () {
            const block = document.getElementById("moveAndHideBlock");
            animaster().moveAndHide(block, 1000);
        });

    document
        .getElementById("moveAndHideReset")
        .addEventListener("click", function () {
            const block = document.getElementById("moveAndHideBlock");
            animaster().resetMoveAndHide(block);
        });

    document
        .getElementById("showAndHidePlay")
        .addEventListener("click", function () {
            const block = document.getElementById("showAndHideBlock");
            animaster().showAndHide(block, 1000);
        });

    document
        .getElementById("heartBeatingPlay")
        .addEventListener("click", function () {
            const block = document.getElementById("heartBeatingBlock");
            heartBeatingHandler = animaster().heartBeating(block);
        });

    document
        .getElementById("heartBeatingStop")
        .addEventListener("click", function () {
            heartBeatingHandler.stop();
        });
}

function animaster() {
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove("hide");
        element.classList.add("show");
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove("show");
        element.classList.add("hide");
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove("show");
        element.classList.add("hide");
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove("hide");
        element.classList.add("show");
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function moveAndHide(element, duration) {
        move(element, (duration * 2) / 5, {x: 100, y: 20});
        setTimeout(
            () => {
                fadeOut(element, (duration * 3) / 5);
            },
            (duration * 2) / 5,
        );
    }

    function resetMoveAndHide(element) {
        resetMoveAndScale(element);
        resetFadeOut(element);
    }

    function showAndHide(element, duration) {
        fadeIn(element, (duration * 1) / 3);
        setTimeout(
            () => {
                fadeOut(element, (duration * 1) / 3);
            },
            (duration * 1) / 3,
        );
    }

    function heartBeating(element) {
        const animationStep = () => {
            scale(element, 500, 1.4);
            setTimeout(() => {
                scale(element, 500, 1);
            }, 500);
        };

        const intervalId = setInterval(animationStep, 1000);
        return {
            stop: () => clearInterval(intervalId),
        };
    }

    function addMove(duration, translation) {
        this._steps.push({
            name: "move",
            duration,
            translation,
        });

        return this;
    }

    function play(element) {
        let delay = 0;
        for (const step of this._steps) {
            setTimeout(() => {
                if (step.name === 'move'){
                    move(element, step.duration, step.translation);
                }
            })
            delay += step.duration;
        }
    }

    return {
        _steps: [],
        play,
        addMove,
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        resetMoveAndHide,
        showAndHide,
        heartBeating,
    };
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(" ");
}
