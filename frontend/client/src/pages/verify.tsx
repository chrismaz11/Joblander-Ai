import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Upload, CheckCircle2, ExternalLink, Copy, Loader2, AlertCircle, Hash, Fuel, Clock, Wallet, Info, TrendingUp, FileCheck } from "lucide-react";

export default function Verify() {
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [fileHash, setFileHash] = useState<string>("");
  const [gasEstimate, setGasEstimate] = useState<any>(null);
  const { toast } = useToast();

  // Fetch gas estimate when file is selected
  const gasEstimateMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiRequest("POST", "/api/estimate-gas", formData);
    },
    onSuccess: (data) => {
      setGasEstimate(data);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiRequest("POST", "/api/verify-resume", formData);
    },
    onSuccess: (data) => {
      setVerificationResult(data);
      toast({
        title: data.verified ? "✅ Resume Verified!" : "❌ Not Verified",
        description: data.verified 
          ? `Found on blockchain at block #${data.blockNumber}` 
          : "This resume has not been verified on the blockchain yet.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Failed to verify resume. Please try again.",
      });
    },
  });

  const createVerificationMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiRequest("POST", "/api/verify-on-chain", formData);
    },
    onSuccess: (data) => {
      setVerificationResult(data);
      if (data.success) {
        toast({
          title: "🎉 Blockchain Verification Created!",
          description: `Transaction confirmed in block #${data.blockNumber}`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Failed to create blockchain verification.",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerificationFile(file);
      setVerificationResult(null);
      
      // Generate hash locally for display
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setFileHash(hashHex);
      
      // Get gas estimate
      gasEstimateMutation.mutate(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  const formatHash = (hash: string) => {
    if (!hash) return "";
    if (hash.length <= 20) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Blockchain Verification</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Secure, tamper-proof resume verification on Polygon Mumbai testnet
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline" className="px-3 py-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Chain ID: 80001
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Fuel className="h-3 w-3 mr-1" />
              Gas: ~0.003 MATIC
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="verify" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="verify" data-testid="tab-verify">
              <FileCheck className="h-4 w-4 mr-2" />
              Verify Resume
            </TabsTrigger>
            <TabsTrigger value="info" data-testid="tab-info">
              <Info className="h-4 w-4 mr-2" />
              How It Works
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verify" className="space-y-8">
            {/* Upload Section */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Upload Resume</h2>
                {verificationFile && gasEstimate && (
                  <Badge variant="secondary" className="px-3 py-1">
                    <Fuel className="h-3 w-3 mr-1" />
                    Est. Cost: {gasEstimate.estimatedCost?.matic} MATIC
                  </Badge>
                )}
              </div>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover-elevate transition-all">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="verify-upload"
                    data-testid="input-verify-upload"
                  />
                  <label htmlFor="verify-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      {verificationFile ? verificationFile.name : "Drop your PDF resume here or click to browse"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF format • Max 10MB • SHA-256 encrypted
                    </p>
                  </label>
                </div>

                {/* File Hash Display */}
                {fileHash && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Document Hash (SHA-256)</Label>
                      <Button
                        onClick={() => copyToClipboard(fileHash)}
                        variant="ghost"
                        size="sm"
                        data-testid="button-copy-file-hash"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <code className="text-xs font-mono text-muted-foreground break-all">
                      {fileHash}
                    </code>
                  </div>
                )}

                {verificationFile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => verifyMutation.mutate(verificationFile)}
                      disabled={verifyMutation.isPending || createVerificationMutation.isPending}
                      size="lg"
                      className="w-full"
                      data-testid="button-verify-existing"
                    >
                      {verifyMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Checking Blockchain...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Check Verification Status
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => createVerificationMutation.mutate(verificationFile)}
                      disabled={createVerificationMutation.isPending || verifyMutation.isPending}
                      variant="outline"
                      size="lg"
                      className="w-full"
                      data-testid="button-create-verification"
                    >
                      {createVerificationMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Broadcasting Transaction...
                        </>
                      ) : (
                        <>
                          <Hash className="h-4 w-4 mr-2" />
                          Create New Verification
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Gas Estimate Info */}
                {gasEstimate && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Gas Limit</p>
                      <p className="font-semibold">{gasEstimate.gasLimit?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Gas Price</p>
                      <p className="font-semibold">{gasEstimate.gasPrice} Gwei</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Network</p>
                      <p className="font-semibold">{gasEstimate.network || "Mumbai"}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Verification Result */}
            {verificationResult && (
              <Card className={`p-8 ${verificationResult.verified || verificationResult.success ? 'bg-chart-3/5 border-chart-3/20' : verificationResult.error ? 'bg-chart-5/5 border-chart-5/20' : 'bg-chart-2/5 border-chart-2/20'}`}>
                <div className="flex items-start gap-4 mb-6">
                  {verificationResult.verified || verificationResult.success ? (
                    <CheckCircle2 className="h-8 w-8 text-chart-3 flex-shrink-0" />
                  ) : verificationResult.error ? (
                    <AlertCircle className="h-8 w-8 text-chart-5 flex-shrink-0" />
                  ) : (
                    <Info className="h-8 w-8 text-chart-2 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">
                      {verificationResult.verified || verificationResult.success 
                        ? "✅ Blockchain Verified" 
                        : verificationResult.error 
                        ? "❌ Verification Error"
                        : "⚠️ Not Yet Verified"}
                    </h3>
                    <p className="text-muted-foreground">
                      {verificationResult.error 
                        ? verificationResult.error
                        : verificationResult.verified || verificationResult.success
                        ? `Verified on ${verificationResult.network || "Polygon Mumbai"} testnet`
                        : "This resume has not been verified on the blockchain yet"}
                    </p>
                  </div>
                </div>

                {(verificationResult.verified || verificationResult.success) && (
                  <div className="space-y-4">
                    {/* Transaction Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {verificationResult.transactionHash && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            Transaction Hash
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              value={formatHash(verificationResult.transactionHash)}
                              readOnly
                              className="font-mono text-sm"
                              data-testid="input-transaction-hash"
                            />
                            <Button
                              onClick={() => copyToClipboard(verificationResult.transactionHash)}
                              variant="outline"
                              size="icon"
                              data-testid="button-copy-hash"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {verificationResult.blockNumber && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Block Number
                          </Label>
                          <Input
                            value={`#${verificationResult.blockNumber.toLocaleString()}`}
                            readOnly
                            className="font-mono"
                            data-testid="input-block-number"
                          />
                        </div>
                      )}

                      {verificationResult.timestamp && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Timestamp
                          </Label>
                          <Input
                            value={new Date(verificationResult.timestamp).toLocaleString()}
                            readOnly
                            data-testid="input-timestamp"
                          />
                        </div>
                      )}

                      {verificationResult.gasUsed && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                            <Fuel className="h-3 w-3" />
                            Gas Used
                          </Label>
                          <Input
                            value={`${verificationResult.gasUsed} MATIC`}
                            readOnly
                            data-testid="input-gas-used"
                          />
                        </div>
                      )}

                      {verificationResult.verifier && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                            <Wallet className="h-3 w-3" />
                            Verifier Address
                          </Label>
                          <Input
                            value={formatHash(verificationResult.verifier)}
                            readOnly
                            className="font-mono text-sm"
                            data-testid="input-verifier"
                          />
                        </div>
                      )}

                      {verificationResult.network && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Network</Label>
                          <Badge variant="outline" className="w-full justify-center py-2" data-testid="badge-network">
                            {verificationResult.network}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Explorer Link */}
                    {verificationResult.explorerUrl && (
                      <Button
                        onClick={() => window.open(verificationResult.explorerUrl, '_blank')}
                        variant="outline"
                        className="w-full"
                        size="lg"
                        data-testid="button-view-explorer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Mumbai PolygonScan
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            )}
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            {/* How It Works */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">How Blockchain Verification Works</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Hash Generation</h4>
                    <p className="text-muted-foreground">
                      Your resume is processed through SHA-256 algorithm to create a unique 32-byte fingerprint. 
                      This hash is deterministic - the same file always produces the same hash.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Smart Contract Storage</h4>
                    <p className="text-muted-foreground">
                      The hash is stored in our ResumeVerifier smart contract on Polygon Mumbai (Chain ID: 80001). 
                      The contract records the hash, timestamp, and verifier address permanently on-chain.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Instant Verification</h4>
                    <p className="text-muted-foreground">
                      Anyone can verify a resume by checking if its hash exists on the blockchain. 
                      The verification is instant and costs no gas (read-only operation).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Tamper Detection</h4>
                    <p className="text-muted-foreground">
                      Any modification to the resume, even a single character, produces a completely different hash. 
                      This makes it impossible to alter verified documents without detection.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Technical Details */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Network Details</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20">Network</Badge>
                      <span>Polygon Mumbai Testnet</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20">Chain ID</Badge>
                      <span>80001</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20">Currency</Badge>
                      <span>MATIC (Test)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20">Explorer</Badge>
                      <span>mumbai.polygonscan.com</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Gas & Costs</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20">Verify</Badge>
                      <span>~100,000 gas units</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20">Batch</Badge>
                      <span>~50,000 gas per hash</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20">Cost</Badge>
                      <span>~0.003 MATIC ($0.0024)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20">Read</Badge>
                      <span>Free (no gas)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Get Test MATIC */}
            <Card className="p-8 bg-muted/50">
              <h3 className="text-xl font-bold mb-4">Need Test MATIC?</h3>
              <p className="text-muted-foreground mb-4">
                To create verifications on the blockchain, you need test MATIC tokens. Get them free from these faucets:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => window.open('https://faucet.polygon.technology/', '_blank')}
                  variant="outline"
                  className="w-full"
                  data-testid="button-faucet-1"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Polygon Faucet (0.2 MATIC)
                </Button>
                <Button
                  onClick={() => window.open('https://mumbaifaucet.com/', '_blank')}
                  variant="outline"
                  className="w-full"
                  data-testid="button-faucet-2"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Alchemy Faucet (0.5 MATIC)
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}