
import { HeartPulse, Activity, Signal, Circle } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <HeartPulse className="h-10 w-10 text-deep-blue" />,
      title: "Real-time Monitoring",
      description: "Tracks stress levels continuously throughout the day with non-invasive biosensors."
    },
    {
      icon: <Activity className="h-10 w-10 text-deep-blue" />,
      title: "Simple LED Indicators",
      description: "Green light means you're calm, red light indicates elevated stress levels."
    },
    {
      icon: <Signal className="h-10 w-10 text-deep-blue" />,
      title: "Companion App",
      description: "Syncs with our mobile app to track patterns and provide personalized insights."
    },
    {
      icon: <Circle className="h-10 w-10 text-deep-blue" />,
      title: "Comfortable Design",
      description: "Lightweight, adjustable headband designed for all-day wear."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">
            Advanced Features for <span className="text-deep-blue">Peace of Mind</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-dark opacity-80 max-w-2xl mx-auto">
            Our headband combines cutting-edge technology with simple, intuitive design
            to help you manage stress effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-neutral-light p-6 rounded-xl shadow-sm feature-card-hover"
            >
              <div className="mb-5 inline-flex items-center justify-center p-3 bg-calm-blue bg-opacity-50 rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-neutral-dark mb-3">{feature.title}</h3>
              <p className="text-neutral-dark opacity-80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
