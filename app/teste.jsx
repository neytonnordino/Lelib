// Next.js + Tailwind CSS
"use client";

import Image from "next/image";

export default function BookSuggestionPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Descubra Livros Incríveis</h1>
        <p className="text-lg text-gray-600">Sugestões personalizadas com críticas e detalhes</p>
      </header>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <BookCard
          title="O Poder do Hábito"
          author="Charles Duhigg"
          description="Um olhar fascinante sobre como hábitos moldam nossas vidas e como mudá-los de forma consciente."
          review="★★★★★ - Leitura essencial para quem busca mudanças duradouras."
          image="/books/habito.jpg"
        />
        <BookCard
          title="Essencialismo"
          author="Greg McKeown"
          description="Um guia para focar no que realmente importa e eliminar o excesso da sua vida."
          review="★★★★☆ - Simples, direto e poderoso."
          image="/books/essencialismo.jpg"
        />
        {/* Adicione mais livros conforme necessário */}
      </section>
    </main>
  );
}

function BookCard({ title, author, description, review, image }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow">
      <div>
        <Image
          src={image}
          alt={`Capa do livro ${title}`}
          width={400}
          height={250}
          className="rounded-lg mb-4 object-cover"
        />
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-500 mb-2">Por {author}</p>
        <p className="text-gray-700 mb-4">{description}</p>
        <p className="text-yellow-500 font-bold">{review}</p>
      </div>
      <button className="mt-4 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors">
        Saber mais
      </button>
    </div>
  );
}
