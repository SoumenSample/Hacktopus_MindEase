
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-20 gradient-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-6">
            Take Control of Your <span className="text-deep-blue">Wellbeing</span>
          </h2>
          
          <p className="text-lg text-neutral-dark opacity-80 max-w-2xl mx-auto mb-8">
            Join thousands of health-conscious individuals who are using MindEase to monitor and 
            manage their stress levels for improved quality of life.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8 py-6 text-lg">
              Get Early Access
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
              Learn More
            </Button>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-soft-green mr-2"></div>
              <span className="text-neutral-dark">Non-invasive monitoring</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-soft-green mr-2"></div>
              <span className="text-neutral-dark">All-day battery life</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-soft-green mr-2"></div>
              <span className="text-neutral-dark">Comfortable design</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
