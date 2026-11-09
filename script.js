
document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".monitor").forEach(function (monitor) {

        const screen = monitor.querySelector(".monitor-screen");
        const img = monitor.querySelector(".monitor-screen img");

        if (!screen || !img) return;

        function scrollWebsite() {

            if (!img.complete || !img.naturalWidth) return;

            const imageHeight =
                img.naturalHeight *
                (screen.clientWidth / img.naturalWidth);

            const distance = imageHeight - screen.clientHeight;

            if (distance <= 0) {
                console.warn("Image is too short to scroll.");
                return;
            }

            const duration = (distance / 100) * 1000;

            img.style.transition = `transform ${duration}ms linear`;
            img.style.transform = `translateY(-${distance}px)`;
        }

        function resetWebsite() {
            img.style.transition = "transform 0.5s ease";
            img.style.transform = "translateY(0)";
        }

        monitor.addEventListener("mouseenter", scrollWebsite);
        monitor.addEventListener("mouseleave", resetWebsite);

    });

});
