
const Technology = () => {
  return (
    <section id="technology" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-6">
              Sophisticated <span className="text-deep-blue">Technology</span>,<br />
              Simple Experience
            </h2>
            
            <div className="space-y-6">
              <div className="bg-neutral-light p-5 rounded-lg">
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">Advanced Biosensors</h3>
                <p className="text-neutral-dark opacity-80">
                  Our proprietary sensors detect subtle changes in skin conductance, 
                  temperature, and blood flow to accurately measure stress levels.
                </p>
              </div>
              
              <div className="bg-neutral-light p-5 rounded-lg">
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">AI-Powered Analytics</h3>
                <p className="text-neutral-dark opacity-80">
                  Machine learning algorithms process biosensor data to provide 
                  accurate, personalized insights about your stress patterns.
                </p>
              </div>
              
              <div className="bg-neutral-light p-5 rounded-lg">
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">Wireless Connectivity</h3>
                <p className="text-neutral-dark opacity-80">
                  Bluetooth Low Energy technology connects to your smartphone for 
                  extended battery life and seamless data synchronization.
                </p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-light shadow-lg relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/5 border-2 border-deep-blue rounded-full flex flex-col items-center justify-center relative">
                    <div className="absolute w-4 h-4 bg-deep-blue rounded-full top-0 transform -translate-y-1/2"></div>
                    <div className="absolute w-4 h-4 bg-deep-blue rounded-full bottom-0 transform translate-y-1/2"></div>
                    
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="relative w-3/4 h-1/2 border-t-2 border-deep-blue">
                        <div className="absolute top-0 left-1/3 w-5 h-5 bg-soft-green rounded-full transform -translate-y-1/2 animate-pulse-gentle"></div>
                        <div className="absolute top-0 right-1/4 w-4 h-4 bg-alert-red rounded-full transform -translate-y-1/2 opacity-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-neutral-dark">Current Status: <span className="text-soft-green">Calm</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-soft-green h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;
