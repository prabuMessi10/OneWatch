import React from 'react';
import Navbar from '../components/Navbar';

const DMCA = () => {
    return (
        <div className="bg-netflix-dark min-h-screen text-gray-300 font-sans">
            <Navbar />
            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-8">DMCA Notice & Takedown Policy</h1>

                <div className="bg-zinc-900/50 p-8 rounded-lg border border-zinc-800">
                    <h2 className="text-2xl font-bold text-white mb-6">DMCA takedown requirements</h2>
                    <p className="mb-6 leading-relaxed">
                        We take the intellectual property rights of others seriously and require that our Users do the same. The Digital Millennium Copyright Act (DMCA) established a process for addressing claims of copyright infringement. If you own a copyright or have authority to act on behalf of a copyright owner and want to report a claim that a third party is infringing that material on or through TrailerFlix's services, please submit a DMCA report, and we will take appropriate action.
                    </p>

                    <h3 className="text-xl font-bold text-white mb-4">DMCA Report requirements</h3>

                    <ul className="list-disc pl-6 space-y-3 mb-8 text-gray-400">
                        <li>A description of the copyrighted work that you claim is being infringed;</li>
                        <li>A description of the material you claim is infringing and that you want removed or access to which you want disabled and the URL or other location of that material;</li>
                        <li>Your name, title (if acting as an agent), address, telephone number, and email address;</li>
                        <li>The following statement: <span className="italic text-gray-300">"I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)"</span>;</li>
                        <li>The following statement: <span className="italic text-gray-300">"The information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right that is allegedly infringed"</span>;</li>
                        <li>An electronic or physical signature of the owner of the copyright or a person authorized to act on the owner's behalf.</li>
                    </ul>

                    <div className="mt-8 p-6 bg-black/40 rounded border border-zinc-800 text-center">
                        <p className="mb-2 text-gray-300">Your DMCA take down request should be submit here:</p>
                        <a href="mailto:trailerflix.dmca@proton.me" className="text-yellow-500 font-bold hover:underline text-lg">trailerflix.dmca@proton.me</a>
                    </div>

                    <p className="mt-6 text-sm text-gray-500 text-center">
                        We will then review your DMCA request and take proper actions, including removal of the content from the website.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DMCA;
