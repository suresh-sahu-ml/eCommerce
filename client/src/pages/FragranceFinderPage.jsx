import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FragranceFinderPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    family: '',
    intensity: '',
    occasion: '',
    season: '',
    priceRange: '',
    notes: ''
  });
  const [recommendations, setRecommendations] = useState(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sample fragrance database
  const fragrances = [
    {
      id: 1,
      name: 'Essence of Roses',
      family: 'Floral',
      intensity: 'Medium',
      occasion: 'Casual',
      season: 'Spring',
      priceRange: 'Mid-range',
      notes: 'Rose',
      rating: 4.5,
      price: 2999
    },
    {
      id: 2,
      name: 'Citrus Dreams',
      family: 'Fresh',
      intensity: 'Light',
      occasion: 'Daily',
      season: 'Summer',
      priceRange: 'Budget',
      notes: 'Citrus',
      rating: 4.3,
      price: 1999
    },
    {
      id: 3,
      name: 'Midnight Elegance',
      family: 'Oriental',
      intensity: 'Strong',
      occasion: 'Party',
      season: 'Winter',
      priceRange: 'Luxury',
      notes: 'Vanilla',
      rating: 4.8,
      price: 5999
    },
    {
      id: 4,
      name: 'Forest Walk',
      family: 'Woody',
      intensity: 'Medium',
      occasion: 'Formal',
      season: 'Fall',
      priceRange: 'Mid-range',
      notes: 'Wood',
      rating: 4.6,
      price: 3499
    },
    {
      id: 5,
      name: 'Garden Bloom',
      family: 'Floral',
      intensity: 'Light',
      occasion: 'Daily',
      season: 'Spring',
      priceRange: 'Budget',
      notes: 'Floral',
      rating: 4.4,
      price: 2299
    },
    {
      id: 6,
      name: 'Ocean Breeze',
      family: 'Fresh',
      intensity: 'Medium',
      occasion: 'Casual',
      season: 'Summer',
      priceRange: 'Mid-range',
      notes: 'Citrus',
      rating: 4.5,
      price: 2899
    },
    {
      id: 7,
      name: 'Spiced Amber',
      family: 'Oriental',
      intensity: 'Medium',
      occasion: 'Party',
      season: 'Fall',
      priceRange: 'Luxury',
      notes: 'Vanilla',
      rating: 4.7,
      price: 4999
    },
    {
      id: 8,
      name: 'Sandalwood Serenity',
      family: 'Woody',
      intensity: 'Light',
      occasion: 'Daily',
      season: 'Winter',
      priceRange: 'Mid-range',
      notes: 'Wood',
      rating: 4.6,
      price: 3199
    }
  ];

  const questions = [
    {
      question: 'What fragrance family appeals to you the most?',
      key: 'family',
      options: ['Floral', 'Fresh', 'Oriental', 'Woody', 'Fruity'],
      icon: 'local_florist'
    },
    {
      question: 'How strong do you prefer the fragrance?',
      key: 'intensity',
      options: ['Light (Subtle)', 'Medium (Balanced)', 'Strong (Bold)'],
      icon: 'intensity'
    },
    {
      question: 'When do you typically wear fragrance?',
      key: 'occasion',
      options: ['Daily Wear', 'Casual', 'Party', 'Formal Events'],
      icon: 'event'
    },
    {
      question: 'Which season do you prefer?',
      key: 'season',
      options: ['Spring', 'Summer', 'Fall', 'Winter'],
      icon: 'cloud'
    },
    {
      question: 'What is your budget?',
      key: 'priceRange',
      options: ['Budget (₹1000-2500)', 'Mid-range (₹2500-4000)', 'Luxury (₹4000+)'],
      icon: 'local_atm'
    },
    {
      question: 'Which notes appeal to you?',
      key: 'notes',
      options: ['Citrus', 'Floral', 'Vanilla', 'Wood', 'Musk'],
      icon: 'auto_awesome'
    }
  ];

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[step].key]: value });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      generateRecommendations();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const generateRecommendations = () => {
    let matches = fragrances.map(frag => {
      let score = 0;

      if (frag.family === answers.family) score += 20;
      if (frag.intensity === answers.intensity) score += 15;
      if (frag.occasion === answers.occasion) score += 15;
      if (frag.season === answers.season) score += 15;
      if (frag.priceRange === answers.priceRange) score += 15;
      if (frag.notes === answers.notes) score += 20;

      return { ...frag, score };
    });

    matches = matches
      .filter(f => f.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    setRecommendations(matches);
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({
      family: '',
      intensity: '',
      occasion: '',
      season: '',
      priceRange: '',
      notes: ''
    });
    setRecommendations(null);
  };

  const currentQuestion = questions[step];

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header scrolled={scrolled} activePage={null} />
      <main className="w-full pt-20 bg-surface">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-4">Fragrance Finder</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Answer a few questions and discover your perfect fragrance
            </p>
          </div>

          {!recommendations ? (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="font-label-sm text-xs uppercase text-on-surface-variant">
                    Question {step + 1} of {questions.length}
                  </span>
                  <span className="font-label-sm text-xs uppercase text-secondary">
                    {Math.round(((step + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-surface-container rounded-lg p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    {currentQuestion.icon}
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 font-body-md ${
                        answers[currentQuestion.key] === option
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-outline-variant hover:border-primary/50 text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            answers[currentQuestion.key] === option
                              ? 'border-primary bg-primary'
                              : 'border-outline-variant'
                          }`}
                        >
                          {answers[currentQuestion.key] === option && (
                            <span className="material-symbols-outlined text-xs text-on-primary">
                              check
                            </span>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={step === 0}
                  className="flex-1 py-3 border border-outline-variant rounded-lg font-label-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.key]}
                  className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-label-sm uppercase tracking-widest hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === questions.length - 1 ? 'See Recommendations' : 'Next'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="mb-8">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                  Your Perfect Match ✨
                </h2>
                <p className="font-body-md text-on-surface-variant mb-6">
                  Based on your preferences, we recommend these fragrances:
                </p>

                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendations.map((frag) => (
                      <div key={frag.id} className="bg-surface-container rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
                          {frag.name}
                        </h3>

                        <div className="space-y-2 mb-4 text-sm font-body-sm text-on-surface-variant">
                          <p>
                            <span className="text-on-surface font-label-sm">Family:</span> {frag.family}
                          </p>
                          <p>
                            <span className="text-on-surface font-label-sm">Intensity:</span> {frag.intensity}
                          </p>
                          <p>
                            <span className="text-on-surface font-label-sm">Occasion:</span> {frag.occasion}
                          </p>
                          <p>
                            <span className="text-on-surface font-label-sm">Notes:</span> {frag.notes}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-headline-sm text-primary">₹{frag.price}</span>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-yellow-500">star</span>
                            <span className="text-sm font-label-sm">{frag.rating}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/products/${frag.id}`)}
                          className="w-full py-2 bg-primary text-on-primary text-sm font-label-sm uppercase tracking-widest rounded hover:bg-secondary transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-surface-container rounded-lg p-8 text-center">
                    <p className="font-body-md text-on-surface-variant">
                      No perfect matches found. Try adjusting your preferences!
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={resetQuiz}
                  className="flex-1 py-3 border border-outline-variant rounded-lg font-label-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
                >
                  Start Over
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-label-sm uppercase tracking-widest hover:bg-secondary transition-colors"
                >
                  Browse All Fragrances
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
