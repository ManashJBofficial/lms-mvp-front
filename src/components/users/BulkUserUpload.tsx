import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useUploadService } from "@/services/upload.service";

const BulkUserUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { uploadTeachers } = useUploadService();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv") {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Missing requirements",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const response = await uploadTeachers(file);

      if (response.results.success > 0) {
        toast({
          title: "Upload successful",
          description: `Successfully added ${response.results.success} teacher${
            response.results.success > 1 ? "s" : ""
          } to the course${
            response.results.failed > 0
              ? `. Failed to add ${response.results.failed} entries.`
              : ""
          }`,
          variant: "default",
        });
      } else {
        toast({
          title: "Upload failed",
          description:
            response.results.errors.length > 0
              ? "Please check the CSV format: name and email are required for each entry"
              : "No teachers were added. Please check your CSV file",
          variant: "destructive",
        });
      }

      setFile(null);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description:
          "Please ensure your CSV file follows the correct format: name,email",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="md:pl-[240px] pl-0 transition-[padding] duration-300">
      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Bulk Teacher Upload</h1>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Upload CSV File</h2>
            <p className="text-sm text-muted-foreground">
              Upload a CSV file containing teacher details. The CSV should have
              the following columns: name, email
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="max-w-md"
              />
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>

          <div className="space-y-4 border rounded-lg p-6 bg-card">
            <div>
              <h3 className="text-base font-semibold mb-2">
                CSV Format Example
              </h3>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                <div className="text-blue-500">name,email</div>
                <div className="text-green-500">John Doe,john@example.com</div>
                <div className="text-green-500">
                  Jane Smith,jane@example.com
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Note: The course ID is automatically added to the CSV file. The
              default password is{" "}
              <span className="font-mono bg-muted px-1 rounded">
                Password@1
              </span>{" "}
              and can be changed from the .env file.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BulkUserUpload;
