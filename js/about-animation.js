(() => {
    const words = document.querySelectorAll('.split-word');

    const activate = (word) => {
        if (word.dataset.started) return;
        word.dataset.started = 'true';
        word.classList.add('is-visible');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => word.classList.add('is-animated'));
        });
    };

    if (!('IntersectionObserver' in window)) {
        words.forEach(activate);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            activate(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.25 });

    words.forEach((word) => observer.observe(word));
})();
