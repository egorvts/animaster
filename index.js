addListeners();

function addListeners() {
    let heartBeatingHandler;
    let resetHandler;

    const worryAnimationHandler = animaster()
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .buildHandler();

    document
        .getElementById("worryAnimationBlock")
        .addEventListener("click", worryAnimationHandler);

    document
        .getElementById("customAnimationPlay")
        .addEventListener("click", function () {
            const block = document.getElementById("customAnimationBlock");
            const customAnimation = animaster()
                .addMove(200, { x: 40, y: 40 })
                .addScale(800, 1.3)
                .addMove(200, { x: 80, y: 0 })
                .addScale(800, 1)
                .addMove(200, { x: 40, y: -40 })
                .addScale(800, 0.7)
                .addMove(200, { x: 0, y: 0 })
                .addScale(800, 1);
            customAnimation.play(block);
        });

    document
        .getElementById("fadeInPlay")
        .addEventListener("click", function () {
            const block = document.getElementById("fadeInBlock");
            animaster().addFadeIn(5000).play(block);
        });

    document
        .getElementById("fadeOutPlay")
        .addEventListener("click", function () {
            const block = document.getElementById("fadeOutBlock");
            animaster().addFadeOut(5000).play(block);
        });

    document.getElementById("movePlay").addEventListener("click", function () {
        const block = document.getElementById("moveBlock");
        animaster().addMove(1000, { x: 100, y: 10 }).play(block);
    });

    document.getElementById("scalePlay").addEventListener("click", function () {
        const block = document.getElementById("scaleBlock");
        animaster().addScale(1000, 1.25).play(block);
    });

    document
        .getElementById("moveAndHidePlay")
        .addEventListener("click", function () {
            const block = document.getElementById("moveAndHideBlock");
            resetHandler = animaster()
                .addMove((1000 * 2) / 5, { x: 100, y: 20 })
                .addDelay((1000 * 2) / 5)
                .addFadeOut((1000 * 3) / 5)
                .play(block);
        });

    document
        .getElementById("moveAndHideReset")
        .addEventListener("click", function () {
            const block = document.getElementById("moveAndHideBlock");
            resetHandler.reset();
        });

    document
        .getElementById("showAndHidePlay")
        .addEventListener("click", function () {
            const block = document.getElementById("showAndHideBlock");
            animaster()
                .addFadeIn(1000 / 3)
                .addDelay(1000 / 3)
                .addFadeOut(1000 / 3)
                .play(block);
        });

    document
        .getElementById("heartBeatingPlay")
        .addEventListener("click", function () {
            const block = document.getElementById("heartBeatingBlock");
            heartBeatingHandler = animaster()
                .addScale(500, 1.4)
                .addDelay(500)
                .addScale(500, 1)
                .play(block, true);
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
        move(element, (duration * 2) / 5, { x: 100, y: 20 });
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

    function addScale(duration, ratio) {
        this._steps.push({
            name: "scale",
            duration,
            ratio,
        });

        return this;
    }

    function addFadeIn(duration) {
        this._steps.push({
            name: "fadeIn",
            duration,
        });

        return this;
    }

    function addFadeOut(duration) {
        this._steps.push({
            name: "fadeOut",
            duration,
        });

        return this;
    }

    function addDelay(duration) {
        this._steps.push({
            name: "delay",
            duration,
        });

        return this;
    }

    function play(element, cycled = false) {
        let delay = 0;

        for (const step of this._steps) {
            if (!this.isPlaying) return;

            setTimeout(() => {
                if (step.name === "move") {
                    move(element, step.duration, step.translation);
                } else if (step.name === "scale") {
                    scale(element, step.duration, step.ratio);
                } else if (step.name === "fadeIn") {
                    fadeIn(element, step.duration);
                } else if (step.name === "fadeOut") {
                    fadeOut(element, step.duration);
                }
            }, delay);

            delay += step.duration;
        }

        if (this.isPlaying && cycled) {
            setTimeout(() => {
                this.play(element, cycled);
            }, delay);
        }

        return {
            stop: () => {
                this.isPlaying = false;
            },
            reset: () => {
                this.isPlaying = false;
                resetMoveAndScale(element);
                resetFadeOut(element);
            },
        };
    }

    function buildHandler() {
        const self = this;
        return function () {
            self.play(this);
        };
    }

    return {
        _steps: [],
        isPlaying: true,
        play,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        addDelay,
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        resetMoveAndHide,
        showAndHide,
        heartBeating,
        buildHandler,
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
