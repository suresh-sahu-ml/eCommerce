import React, { useEffect, useRef } from 'react';

const FAMILIES = [
  {
    id: 'floral',
    name: 'Floral & Ethereal',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8zpBhIMS2BoLo1vGpZkiLeFgfOMkLIan_bdnJIiA1D6hZd4wAxOeDSRD-oqpXMsSsrRA03nVd76OSzS8IWPEHpDJRYppQn4o4PqJf78PI-61sjSWZBDFSIMwAsipK8GXso-usJPVp1XQgoJmEDTNcC1FMLehba6yAStwj4sKuktp1cb5fky5UrUI7zn7uHX6XOjbMjrHhuqwSFtopCQAqRBrsIuqhdGTV4fIBSHCFlhAl-Qtv87rN',
  },
  {
    id: 'woody',
    name: 'Woody & Deep',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-6R2JtfIaoLyiS5L-ekCBF37dW-DFDNyukXd1UBMl5-T19UimCp5Dv8APbvyRn0vhA0NmWcl5hPgNQT_FMixFridZhrTUW5bFbvavuVvAc0DzdhdCZE8Rsd47ZCF094c0VQE1gwL3txTKz4cSbfSlbL91k3FoXRFWlK65Bl8myj0WKEbN6z0Cc46xWrd0ETqR21-Dg3d3fvYRjLaQHko8FfJyG6OQnOinqILPLlkoaLAOkJIv85rD',
  },
  {
    id: 'citrus',
    name: 'Citrus & Bright',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-iZYgeHxssC8orMR4wf3gTrNNI7_riy3itCqJIrlWNkHpdBN7-GoVuxDivcnFx43-XH-QwVzt9OOdCc1BMyBEzBHA8R2h1BtX7GWwXoB9UygLHi5k0AlC7tTYM8lG5i6C3Xf6EjeK_gkixlUPOE2fOVk9mO6-V8rVS4Nvv3nceI2LvEPYF_mRE-SfeyxNGUqNFx2TeiobTY-gqaqAi6YH6O622lwpHXUx8Ij15rLTEdNwmQzv8s_n',
  },
  {
    id: 'spiced',
    name: 'Spiced & Warm',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6l1Q13-BrkAfHRDXCWtR-xpZrmfoktKgvDsd2wlKqB_js7dAYD5ce2fysI1dWckafJmz6pGnfJIXnv4mwIkKsmJW_uAkl7JTiUGubVno7PD4pTtQNfmc6CPTs4VwRih1ERVI5QOqiaJv1RZP7KG9niDLZEqDcAqhiBdmijevrcNTU2-ogJnSwfjXSd__hcim9xxfQlmMGegnR5EwdEcTtlLrr7BHFyYjkMJEWazPaoOYiWN1u8J4d',
  },
];

export default function OlfactiveSection() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3 p-4 pt-12 reveal active">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-on-background font-headline-lg tracking-light text-[32px] font-bold leading-tight">
            Olfactive Families
          </p>
          <p className="text-neutral-500 text-sm font-normal leading-normal font-body-lg">
            Explore scents by their character and depth
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 p-4">
        {FAMILIES.map((family, index) => (
          <FamilyCard key={family.id} family={family} index={index} />
        ))}
      </div>
    </div>
  );
}

function FamilyCard({ family, index }) {
  return (
    <div
      className="reveal group relative overflow-hidden bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-6 aspect-[3/4] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer active"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 60%), url('${family.image}')`,
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      <p className="text-white text-xl font-bold leading-tight w-full transition-transform duration-500 group-hover:translate-x-2">
        {family.name}
      </p>
    </div>
  );
}
