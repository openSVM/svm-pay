import Flutter
import UIKit

public class SvmPayPlugin: NSObject, FlutterPlugin {
    public static func register(with registrar: FlutterPluginRegistrar) {
        let channel = FlutterMethodChannel(name: "com.opensvm.svm_pay", binaryMessenger: registrar.messenger())
        let instance = SvmPayPlugin()
        registrar.addMethodCallDelegate(instance, channel: channel)
    }

    public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        switch call.method {
        case "processPayment":
            guard let args = call.arguments as? [String: Any],
                  let request = args["request"] as? [String: Any],
                  let config = args["config"] as? [String: Any] else {
                result(FlutterError(code: "INVALID_ARGUMENTS", message: "Missing request or config", details: nil))
                return
            }
            
            processPayment(request: request, config: config, result: result)
            
        case "getWalletBalance":
            guard let args = call.arguments as? [String: Any],
                  let address = args["address"] as? String,
                  let network = args["network"] as? String else {
                result(FlutterError(code: "INVALID_ARGUMENTS", message: "Missing address or network", details: nil))
                return
            }
            
            let tokenMint = args["tokenMint"] as? String
            getWalletBalance(address: address, network: network, tokenMint: tokenMint, result: result)
            
        default:
            result(FlutterMethodNotImplemented)
        }
    }
    
    private func processPayment(request: [String: Any], config: [String: Any], result: @escaping FlutterResult) {
        DispatchQueue.global(qos: .background).async {
            // Enhanced security: Validate request parameters
            guard let type = request["type"] as? String,
                  let network = request["network"] as? String,
                  !type.isEmpty, !network.isEmpty else {
                result(FlutterError(code: "INVALID_PARAMETERS", message: "Invalid request parameters", details: nil))
                return
            }
            
            // Validate network is supported
            let supportedNetworks = ["solana", "sonic", "eclipse", "soon"]
            guard supportedNetworks.contains(network) else {
                result(FlutterError(code: "UNSUPPORTED_NETWORK", message: "Unsupported network: \(network)", details: nil))
                return
            }
            
            // Simulate payment processing with timeout
            let group = DispatchGroup()
            group.enter()
            
            var paymentResult: [String: Any]?
            
            // 30 second timeout
            DispatchQueue.global().asyncAfter(deadline: .now() + 30) {
                if paymentResult == nil {
                    paymentResult = [
                        "status": "failed",
                        "network": network,
                        "error": "Payment request timed out"
                    ]
                    group.leave()
                }
            }
            
            // Simulate processing
            DispatchQueue.global().asyncAfter(deadline: .now() + 2) {
                if paymentResult == nil {
                    // For demo purposes, use more realistic success/failure logic
                    let isSuccess = Int.random(in: 0...2) >= 1 // 67% success rate
                    
                    if isSuccess {
                        paymentResult = [
                            "status": "confirmed",
                            "network": network,
                            "signature": self.generateSecureSignature()
                        ]
                    } else {
                        paymentResult = [
                            "status": "failed",
                            "network": network,
                            "error": "Payment processing failed: Please try again"
                        ]
                    }
                    group.leave()
                }
            }
            
            group.wait()
            
            DispatchQueue.main.async {
                result(paymentResult!)
            }
        }
    }
    
    private func getWalletBalance(address: String, network: String, tokenMint: String?, result: @escaping FlutterResult) {
        DispatchQueue.global(qos: .background).async {
            // Enhanced security: Validate inputs
            guard !address.isEmpty, !network.isEmpty else {
                DispatchQueue.main.async {
                    result(FlutterError(code: "INVALID_PARAMETERS", message: "Invalid parameters", details: nil))
                }
                return
            }
            
            // Validate network is supported
            let supportedNetworks = ["solana", "sonic", "eclipse", "soon"]
            guard supportedNetworks.contains(network) else {
                DispatchQueue.main.async {
                    result(FlutterError(code: "UNSUPPORTED_NETWORK", message: "Unsupported network: \(network)", details: nil))
                }
                return
            }
            
            // 15 second timeout
            let group = DispatchGroup()
            group.enter()
            
            var balance: String?
            
            DispatchQueue.global().asyncAfter(deadline: .now() + 15) {
                if balance == nil {
                    balance = "0.0"
                    group.leave()
                }
            }
            
            DispatchQueue.global().asyncAfter(deadline: .now() + 1) {
                if balance == nil {
                    let rpcUrl = self.getRpcEndpoint(network: network)
                    balance = String(self.queryBalance(rpcUrl: rpcUrl, address: address, tokenMint: tokenMint))
                    group.leave()
                }
            }
            
            group.wait()
            
            DispatchQueue.main.async {
                result(balance!)
            }
        }
    }
    
    private func getRpcEndpoint(network: String) -> String {
        switch network {
        case "solana":
            return "https://api.mainnet-beta.solana.com"
        case "sonic":
            return "https://rpc.sonic.game"
        case "eclipse":
            return "https://mainnetbeta-rpc.eclipse.xyz"
        case "soon":
            return "https://rpc.soon.money"
        default:
            return "https://api.mainnet-beta.solana.com"
        }
    }
    
    private func queryBalance(rpcUrl: String, address: String, tokenMint: String?) -> Double {
        // This is a mock implementation
        // Real implementation would make RPC calls to get actual balances
        return Double.random(in: 0.0...10.0) // Return random balance for demo
    }
    
    private func generateSecureSignature() -> String {
        // Generate a more realistic signature format for Solana
        let chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
        return String((0..<88).map { _ in chars.randomElement()! })
    }
}
