import Container from "@/component/UI/Container";

export function Biosection() {
  return (
    <section className="w-full py-12 sm:py-16">
      <Container className="flex items-center justify-center">
        <div className="max-w-3xl rounded-2xl border border-dark-one/10 bg-white/60 p-6 sm:p-10 md:p-12 shadow-xs backdrop-blur-xs text-center">
          <p className="font-content text-base sm:text-lg md:text-xl font-normal leading-relaxed text-muted">
            I am an engineer in the oil and gas sector with a B.Eng. in Electrical
            and Electronics Engineering, driven by a passion for building systems,
            solving problems, and making complex ideas easier to understand. My
            interests sit at the intersection of engineering, reliable energy,
            technology, and people development. I founded{" "}
            <span className="font-bold text-dark-one underline decoration-accent decoration-2 underline-offset-4">
              Donate Drive
            </span>{" "}
            to help children from underserved communities discover purpose and
            access opportunities that shape their future. At the core of
            everything I do is a simple desire: to build, to teach, to create,
            and to help people become better.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default Biosection;
