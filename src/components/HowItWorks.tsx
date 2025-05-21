
import { Check } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Put on the Headband",
      description: "The comfortable, adjustable headband sits securely on your forehead."
    },
    {
      number: "02",
      title: "Biosensors Activate",
      description: "Advanced sensors detect subtle physiological changes associated with stress."
    },
    {
      number: "03",
      title: "LED Provides Feedback",
      description: "Green light indicates calm state, while red signals elevated stress levels."
    },
    {
      number: "04",
      title: "Take Action",
      description: "Use the feedback to take a break, practice breathing, or continue your activity."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 gradient-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">
            How <span className="text-deep-blue">MindEase</span> Works
          </h2>
          <p className="mt-4 text-lg text-neutral-dark opacity-80 max-w-2xl mx-auto">
            Simple to use, yet powered by sophisticated technology to give you accurate insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-6 rounded-xl shadow-sm h-full">
                <div className="text-deep-blue font-bold text-4xl opacity-30 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-neutral-dark mb-3">{step.title}</h3>
                <p className="text-neutral-dark opacity-80">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-deep-blue flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-xl shadow-sm max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-calm-blue">
                <div className="w-12 h-12 rounded-full bg-soft-green animate-pulse-gentle"></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-dark mb-2">Intuitive LED Feedback System</h3>
              <p className="text-neutral-dark opacity-80">
                Green indicates normal stress levels, providing reassurance that you're in a balanced state.
                Red signals elevated stress, prompting you to take action and manage your mental wellbeing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
