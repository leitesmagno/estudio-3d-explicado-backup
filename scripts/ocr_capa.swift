import Foundation
import Vision
import AppKit
let a = CommandLine.arguments
guard let img = NSImage(contentsOfFile: a[1]), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { exit(1) }
let r = VNRecognizeTextRequest(); r.recognitionLevel = .accurate; r.recognitionLanguages = ["pt-BR"]; r.usesLanguageCorrection = false
try VNImageRequestHandler(cgImage: cg).perform([r])
let h = Double(cg.height)
for o in ((r.results as? [VNRecognizedTextObservation]) ?? []).sorted(by: { $0.boundingBox.minY > $1.boundingBox.minY }) {
  if let t = o.topCandidates(1).first { print(Int((1 - o.boundingBox.maxY) * h), t.string) }
}
