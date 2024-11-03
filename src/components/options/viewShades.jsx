import React from 'react'

const ViewShades = ({ shades, setColorShade, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-20 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Shades</h3>
        <div className="flex flex-wrap gap-2">
          {shades.map((shade, idx) => (
            <div
              onClick={(e) => { setColorShade(e, shade) }}
              key={idx}
              className="w-12 h-12"
              style={{ backgroundColor: shade }}
            ></div>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 text-blue-500">
          Close
        </button>
      </div>
    </div>
  )
}

export default ViewShades;
