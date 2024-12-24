export const SemiCircle = ({ color = "black", className = "", children }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 200 200" // Adjust the viewBox to match the path's dimensions
      fill="none"
      className={className} // Allow Tailwind styles via props
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100H200Z"
        fill={color}
      />
      {children /* Render any child components passed as props */}
    </svg>
  );
};

export const Circle = ({ color = "black", className = "", children }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="50" fill={color} />
      {children}
    </svg>
  );
};

export const Square = ({ color = "black", className = "", children }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" fill={color} />
      {children}
    </svg>
  );
};

export const RoundedSquare = ({ color = "black", className = "", children }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      className={className}
    >
      <rect x="0" y="0" width="100" height="50" rx="25px" fill={color} />
      {children}
    </svg>
  );
};

export const TwoSquares = ({ color = "currentColor", className = "", children }) => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_104_231)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M100 0H0V100H100V200H200V100H100V0Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_104_231">
          <rect width="200" height="200" fill="white" />{" "}
        </clipPath>
      </defs>
      {children}
    </svg>
  );
};

export const Leave = ({ color = "black", className = "", children }) => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0)">
        <path
          d="M0 0H100C155.228 0 200 44.7715 200 100V200H100C44.7715 200 0 155.228 0 100V0Z"
          fill={color} // Apply dynamic color here
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="200" height="200" fill="white" />
        </clipPath>
      </defs>
      {children /* Render child components if passed */}
    </svg>
  );
};

export const DoubleTriangle = ({ color = "black", className = "", children }) => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M200 100.671L100 0L0 100.671H98.6668L0 200H200L101.333 100.671H200Z"
          fill={color} // Use dynamic color here
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="200" height="200" fill="white" />
        </clipPath>
      </defs>
      {children /* Render child components if passed */}
    </svg>
  );
};



        {
          /* <div
          className="relative w-2/5 h-full"
          style={{ backgroundColor: colors[0] }}
        >
          <SemiCircle
            color={colors[1]}
            className="absolute top-0 -left-[101px] rotate-90"
          />
          <SemiCircle
            color={colors[2]}
            className="w-36 h-36 absolute top-[56px] -left-[72px] -rotate-90"
          />
          <SemiCircle
            color={colors[3]}
            className="w-24 h-24 z-10 absolute bottom-0 -left-[48px] -rotate-90"
          />
          <TwoSquares
            color={colors[1]}
            className="z-10 w-48 h-48 absolute top-[200px] left-0"
          />
          <Circle
            color={colors[colors.length - 1]}
            className="h-48 w-48 absolute top-[200px] -left-[96px]"
          />
          <RoundedSquare
            color={colors[4]}
            className="w-48 h-48 absolute top-[104px] left-[96px] rotate-90"
          />
          <Square
            color={colors[colors.length - 1]}
            className="w-24 h-24 absolute bottom-0 -left-[96px]"
          />

          <Square
            color={colors[colors.length - 2]}
            className="z-10 w-[5.5rem] h-[5.5rem] absolute top-[387.5px] left-[282.5px]"
          />
          <Circle
            color={colors[colors.length - 2]}
            className="w-44 h-44 absolute top-[300px] left-[195px] -rotate-90"
          />

          <Square
            color={colors[colors.length - 3]}
            className="z-10 w-24 h-24 absolute bottom-0 left-0"
          />
          <Circle
            color={colors[colors.length - 3]}
            className="w-[11.85rem] h-[11.85rem] absolute bottom-0 left-0 -rotate-90"
          />
        </div> */
        }
